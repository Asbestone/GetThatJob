import { cohereService } from "./cohere";
import { zillizService } from "./zilliz";
import { generateAnswer } from "./gemini";
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

export async function runRAG(query: string) {
    const queryEmbedding = await cohereService.generateQueryEmbedding(query)

    const targetCompany = "Jane Street"

    const similar = await zillizService.searchSimilarResumes(queryEmbedding, targetCompany, 5)

    const context = similar
        .map(r => {
            let skills: string[] = [];
            try {
                skills = Array.isArray(r.skills) ? r.skills : JSON.parse(r.skills || "[]");
            } catch (e) {
                console.warn("Failed to parse skills for resume", r.id, r.skills);
            }
            return `Resume:\n${r.resume_text}\nSkills: ${skills.join(", ")}`;
        })
        .join("\n---\n");

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