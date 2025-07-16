import { NextResponse } from "next/server";
import { zillizService } from "@/app/lib/zilliz";

export async function GET() {
    try {
        const companies = await zillizService.getCompanies()
        return NextResponse.json({ companies: companies })
    } catch (error) {
        console.error("Error fetching companies:", error);
    return NextResponse.json({ error: 'Failed to retrieve company list.' }, { status: 500 });
    }
}