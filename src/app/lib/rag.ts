import { cohereService } from "./cohere";
import { zillizService } from "./zilliz";
import { generateAnswer, extractCompany } from "./gemini";
import fs from "fs";
import path from "path";

const MAX_CONTEXT_WINDOW = parseInt(process.env.MAX_CONTEXT_WINDOW || "5000")

export async function runRAG(query: string, chatHistory: string = "") {
    const queryEmbedding = await cohereService.generateQueryEmbedding(query)

    const targetCompany = await extractCompany(query);

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
        .join("\n---\n")

    const promptPath = path.join(process.cwd(), 'src', 'app', 'prompts', 'generate-answer.txt')
    const prompt = fs.readFileSync(promptPath, 'utf8')

    const fullContext = `
        Conversation History:
        ${chatHistory}\n

        Retrieved Context:
        ${context}\n

        Target Company:
        ${targetCompany ? targetCompany : "No company"}\n

        User's Question:
        ${query}\n
        
        Prompt:
        ${prompt}`

    console.log("CHATHISTORY")
    console.log(chatHistory, '\n')

    if (fullContext.length > MAX_CONTEXT_WINDOW) {
        console.warn(`Server: Context window limit exceeded! Request rejected. Length: ${fullContext.length}. Limit: ${MAX_CONTEXT_WINDOW}`)
        throw new Error(`Chat context window limit exceeded (${MAX_CONTEXT_WINDOW} characters). Please refresh chat to start a new conversation.`)
    }

    let answer: string
    try {
        answer = await generateAnswer(fullContext)
    } catch (error) {
        console.error("Failed to generate answer:", error)
        answer = "Sorry, I couldn't generate an answer at this time."
    }

    return {
        results: similar,
        answer,
        targetCompany
    }
}