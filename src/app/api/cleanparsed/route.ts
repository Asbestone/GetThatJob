import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getToken } from "next-auth/jwt";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  console.log("Cleaning parsed data and returning as json");

  try {
    // Check if this is a dev mode request or regular request
    const contentType = req.headers.get("content-type");
    let rawText: string;
    let devMode = false;
    let token = null;

    if (contentType?.includes("application/json")) {
      // Dev mode - JSON payload with devMode flag
      const body = await req.json();
      rawText = body.rawText;
      devMode = body.devMode || false;
    } else {
      // Legacy mode - raw text body
      rawText = await req.text();
    }

    // Handle authentication - skip for dev mode
    if (!devMode) {
      token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (!token) {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 }
        );
      }
    } else {
      console.log("🚧 Development mode - skipping authentication");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

    const cleaningPromptPath = path.join(
      process.cwd(),
      "src",
      "app",
      "prompts",
      "clean-parsed-resume.txt"
    );
    const cleaningPrompt = fs.readFileSync(cleaningPromptPath, "utf8");

    const featurePromptPath = path.join(
      process.cwd(),
      "src",
      "app",
      "prompts",
      "extract-features.txt"
    );
    const featurePrompt = fs.readFileSync(featurePromptPath, "utf8");

    const [aiResponseClean, aiResponseFeature] = await Promise.all([
      ai.models.generateContent({
        model: "gemini-2.0-flash-lite", // this model is ideal for our usecase with higher rpm and lower performance
        contents: cleaningPrompt + rawText,
      }),

      ai.models.generateContent({
        model: "gemini-2.0-flash-lite",
        contents: featurePrompt + rawText,
      }),
    ]);

    const cleanedText = aiResponseClean.text || "";
    const featureText = aiResponseFeature.text || "";

    // Parse the cleaned JSON data
    let parsedResumeData;
    try {
      const rawParsedJSON = cleanedText
        .trim()
        .replace(/^```json\s*/, "")
        .replace(/```$/, "")
        .trim();
      parsedResumeData = JSON.parse(rawParsedJSON);
    } catch (parseError) {
      console.error("Error parsing cleaned resume data:", parseError);
      // Continue without parsing if it fails
      return NextResponse.json({ 
        cleanedText, 
        featureText,
        parsed: false,
        error: "Failed to parse resume data"
      });
    }

    console.log("Resume successfully cleaned and parsed");

    return NextResponse.json({
      cleanedText,
      featureText,
      parsedData: parsedResumeData,
      parsed: true,
    });
  } catch (error) {
    console.error("Error in cleanparsed API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
