import { NextRequest, NextResponse } from "next/server";
import { runRAG } from "@/app/lib/rag";
import type { Content } from "@google/genai";

export async function POST(req: NextRequest) {
    try {
        const { query, chatHistory } = await req.json()

        if (!query?.trim()) {
            return NextResponse.json({ error: "Missing query" }, { status: 400 })
        }
        
        const parsedChatHistory: Content[] = chatHistory
        const ragResult = await runRAG(query.trim(), parsedChatHistory)
        
        return NextResponse.json({
            answer: ragResult.answer,
            targetCompany: ragResult.targetCompany,
            updatedChatHistory: ragResult.updatedChatHistory
        })

    } catch (error: any) {
        console.error("❌ Chat API error:", error)
        
        const errorMessage = error.message.includes("context window limit exceeded")
            ? error.message // Pass the specific error message from rag.ts
            : "Internal server error. Please try again later."

        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        )

    }
    
}