import { NextRequest, NextResponse } from "next/server";
import { runRAG } from "@/app/lib/rag";

export async function POST(req: NextRequest) {

    try {

        const { query } = await req.json()

        if (!query?.trim()) {
            return NextResponse.json({ error: "Missing query" }, { status: 400 })
        }

        const ragResult = await runRAG(query.trim())
        return NextResponse.json(ragResult)

    } catch (error) {

        console.error("❌ Chat API error:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        )

    }
    
}