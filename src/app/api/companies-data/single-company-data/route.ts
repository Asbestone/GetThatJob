import { NextResponse } from "next/server";
import { zillizService } from "@/app/lib/zilliz";
import { cohereService } from "@/app/lib/cohere";
import { generateAnswer } from "@/app/lib/gemini";
import path from "path";
import fs from "fs";
import { JsonError } from "cohere-ai/core/schemas";

interface CompanyInsights {
    skills: string[]
    prev_exp: string[]
    education: string[]
    tech_stack: string[]
    project_themes: string[]
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const companyName = searchParams.get('company')

    if (!companyName) {
        return NextResponse.json({ error: 'Company name is required for this API call.' }, { status: 400 })
    }

    try {
        // delay fetching data
        // await new Promise(resolve => setTimeout(resolve, 8000))
        
        const company = decodeURIComponent(companyName);
        const query = `Skils and Experiences for ${company}`
        const queryVector = await cohereService.generateQueryEmbedding(query);

        const resumes = await zillizService.searchSimilarResumes(queryVector, company, 5)
        
        if (resumes.length === 0) {
            return NextResponse.json({
                companyName: company,
                insights: {
                    skills: [],
                    prev_exp: [],
                    education: [],
                    tech_stack: [],
                    project_themes: []
                }
            }, { status: 200 })
        }

        const context = resumes.map((r, idx) => {
            const skills = typeof r.skills === 'string' ? JSON.parse(r.skills || '[]') : r.skills
            const jobTitles = typeof r.job_titles === 'string' ? JSON.parse(r.job_titles || '[]') : r.job_titles
            const companies = typeof r.companies === 'string' ? JSON.parse(r.companies || '[]') : r.companies
            return `--- Resume ${idx + 1} for ${company} ---
                    Resume Text: ${r.resume_text}
                    Skills: ${skills.join(', ')}
                    Experience: ${r.resume_text}
                    Experience Years: ${r.experience_years}
                    Education Level: ${r.education_level}
                    Job Titles: ${jobTitles.join(', ')}
                    Previous Companies: ${companies.join(', ')}
                    `
        }).join('\n')

        const promptPath = path.join(process.cwd(), 'src', 'app', 'prompts', 'get-company-insights.txt')
        const prompt = fs.readFileSync(promptPath, 'utf8')

        const fullPrompt = `${prompt}\n\nRetrieved Resumes:\n${context}`
        const insightsTxt = await generateAnswer(fullPrompt)

        let insights: CompanyInsights
        try {
            const cleanedResponse = insightsTxt
                .trim()
                .replace(/^```json\s*/, "")
                .replace(/```$/, "")

            insights = JSON.parse(cleanedResponse)

        } catch (jsonError) {
            console.error("Failed to parse LLM response to JSON", JsonError)
            console.log("Raw LLM response: ", insightsTxt)
            throw new Error("Failed to generate valid JSON insights")
        }
        
        console.log(insights)
        return NextResponse.json({ companyName: decodeURIComponent(companyName), insights }, { status: 200 })
    
    } catch (error) {
        console.error(`Error fetching insights for ${companyName}:`, error)
        return NextResponse.json({ error: `Failed to retrieve insights for ${decodeURIComponent(companyName)}.` }, { status: 500 })
    }
}