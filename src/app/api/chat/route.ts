import { NextRequest, NextResponse } from "next/server";
import { runRAG } from "@/app/lib/rag";

export async function POST(req: NextRequest) {
    const { query, targetCompany } = await req.json()

    if (!query) {
        return NextResponse.json({ error: "Missing query" }, { status: 400 })
    }

    const ragResult = await runRAG(query, targetCompany)
    return NextResponse.json(ragResult)
}