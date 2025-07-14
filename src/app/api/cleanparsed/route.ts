import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    console.log("Cleaning parsed data and returning as json");
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API});

    const rawText = await req.text();
    const cleaningPromptPath = path.join(process.cwd(), 'src', 'app', 'prompts', 'clean-parsed-resume.txt');
    const cleaningPrompt = fs.readFileSync(cleaningPromptPath, 'utf8');

    const featurePromptPath = path.join(process.cwd(), 'src', 'app', 'prompts', 'extract-features.txt');
    const featurePrompt = fs.readFileSync(featurePromptPath, 'utf8');


    const [aiResponseClean, aiResponseFeature] = await Promise.all([
        ai.models.generateContent({
            model: "gemini-2.0-flash-lite", // this model is ideal for our usecase with higher rpm and lower performance
            contents: cleaningPrompt + rawText,
        }),

        ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: featurePrompt + rawText,
        })
    ])

    //console.log(aiResponse.text);
    //console.log(rawText);

    const cleanedText = aiResponseClean.text;
    const featureText = aiResponseFeature.text;

    console.log("Succesfully processed raw parsed data");
    return NextResponse.json({ cleanedText, featureText });
}