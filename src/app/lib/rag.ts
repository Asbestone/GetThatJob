import { cohereService } from "./cohere";
import { zillizService } from "./zilliz";
import { generateAnswer } from "./gemini";

export async function runRAG(query: string, targetCompany?: string) {
    const queryEmbedding = await cohereService.generateQueryEmbedding(query)
    const similar = await zillizService.searchSimilarResumes(queryEmbedding, targetCompany, 5)

    const context = similar
        .map(r => `Resume:\n${r.resume_text}\nSkills: ${r.skills.join(", ")}`)
        .join("\n---\n")

    let answer: string
    try {
        answer = await generateAnswer(context, query)
    } catch (error) {
        console.error("Failed to generate answer:", error)
        answer = "Sorry, I couldn't generate an answer at this time."
    }

    return {
        results: similar,
        answer,
    }
}