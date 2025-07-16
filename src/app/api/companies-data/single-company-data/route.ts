import { NextResponse } from "next/server";
import { zillizService } from "@/app/lib/zilliz";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const companyName = searchParams.get('company')

    if (!companyName) {
        return NextResponse.json({ error: 'Company name is required for this API call.' }, { status: 400 })
    }

    try {
        // delay fetching data
        //await new Promise(resolve => setTimeout(resolve, 800))

        const insights = `
        Detailed insights for ${decodeURIComponent(companyName)}:

        - **Average Applicant Profile**: Candidates targeting ${decodeURIComponent(companyName)} often have X years of experience, specializing in Y skills.
        - **Top Skills in Resumes**: Common skills include: JavaScript, Python, Cloud Computing (AWS/Azure/GCP), Data Analysis.
        - **Education Trends**: A significant portion of successful candidates hold degrees in Computer Science or related engineering fields.
        - **Related Job Titles**: Frequently seen job titles in previous roles are Software Engineer, Data Scientist, Product Manager.
        - **Strategic Observations**: ${decodeURIComponent(companyName)} appears to focus on hiring for growth in A and B departments.
        - **Latest Entry**: Last updated on ${new Date().toLocaleDateString()}.
        `;

        return NextResponse.json({ companyName: decodeURIComponent(companyName), insights })
    } catch (error) {
        console.error(`Error fetching insights for ${companyName}:`, error)
        return NextResponse.json({ error: `Failed to retrieve insights for ${decodeURIComponent(companyName)}.` }, { status: 500 })
    }
}