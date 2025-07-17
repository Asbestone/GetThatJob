import { NextRequest, NextResponse } from "next/server";
import { runRAG } from "@/app/lib/rag";

export async function POST(req: NextRequest) {
    try {
        const { query, chatHistory } = await req.json()

        if (!query?.trim()) {
            return NextResponse.json({ error: "Missing query" }, { status: 400 })
        }

        const ragResult = await runRAG(query.trim(), chatHistory)
        return NextResponse.json(ragResult)

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