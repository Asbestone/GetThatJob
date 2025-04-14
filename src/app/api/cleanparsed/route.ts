import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    console.log("Cleaning parsed data and returning as json");
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API});

    const rawText = await req.text();
    const promptPath = path.join(process.cwd(), 'src', 'app', 'prompts', 'clean-parsed-resume.txt');
    const cleaningPrompt = fs.readFileSync(promptPath, 'utf8');

    const aiResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash-lite", // this model is ideal for our usecase with higher rpm and lower performance
        contents: cleaningPrompt + rawText,
    });

    //console.log(aiResponse.text);
    //console.log(rawText);

    const cleanedText = aiResponse.text;
    return NextResponse.json({ cleanedText });
}