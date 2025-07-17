import { NextRequest, NextResponse } from "next/server";
import { generateAnswer } from "@/app/lib/gemini";
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    console.log("Cleaning parsed data and returning as json")

    const rawText = await req.text();
    const cleaningPromptPath = path.join(process.cwd(), 'src', 'app', 'prompts', 'clean-parsed-resume.txt')
    const cleaningPrompt = fs.readFileSync(cleaningPromptPath, 'utf8');

    const featurePromptPath = path.join(process.cwd(), 'src', 'app', 'prompts', 'extract-features.txt')
    const featurePrompt = fs.readFileSync(featurePromptPath, 'utf8');


    const [aiResponseClean, aiResponseFeature] = await Promise.all([
        generateAnswer(cleaningPrompt + rawText),
        generateAnswer(featurePrompt + rawText)
    ])

    //console.log(aiResponse.text);
    //console.log(rawText);

    const cleanedText = aiResponseClean;
    const featureText = aiResponseFeature;

    console.log("Succesfully processed raw parsed data");
    return NextResponse.json({ cleanedText, featureText });
}