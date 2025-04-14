import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: "sdfsdf"});

export async function POST(req: NextRequest) {
    console.log("Cleaning parsed data and returning as json");
    const cleanedText = await req.text();



    return NextResponse.json({ cleanedText });
}