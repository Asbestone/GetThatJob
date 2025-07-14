import { cohereService } from "./cohere";
import { zillizService } from "./zilliz";
import { generateAnswer } from "./gemini";

export async function runRAG(query: string, targetCompany?: string) {
    const queryEmbedding = await cohereService.generateQueryEmbedding(query)
    const similar = await zillizService.searchSimilarResumes(queryEmbedding, targetCompany, 5)

    const context = similar
        .map(r => `Resume:\n${r.resume_text}\nSkills: ${r.skills.join(", ")}`)
        .join("\n---\n")

    const answer = await generateAnswer(context, query)

    return {
        results: similar,
        answer,
    }
}