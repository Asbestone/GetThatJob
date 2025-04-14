import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
    console.log("Cleaning parsed data and returning as json");
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API});

    const cleanedText = await req.text();

    const aiResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite", // this model is ideal for our usecase with higher rpm and lower performance
        contents: "explain how ai works in 10 words",
    });

    console.log(aiResponse.text);
    console.log(cleanedText);

    return NextResponse.json({ cleanedText });
}