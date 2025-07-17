import { cohereService } from "./cohere";
import { zillizService } from "./zilliz";
import { generateAnswer, extractCompany } from "./gemini";

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
        .join("\n---\n");

    const fullPromptContext = `
        Conversation History:
        ${chatHistory}

        Retrieved Relevant Context:
        ${context}

        User's Current Question:
        ${query}

        Based on the above conversation history and provided context, answer the user's current question.
        If the relevant information is not in the provided contexts, state that you don't have enough information.`

    if (fullPromptContext.length > MAX_CONTEXT_WINDOW) {
        console.warn(`Server: Context window limit exceeded! Request rejected. Length: ${fullPromptContext.length}. Limit: ${MAX_CONTEXT_WINDOW}`)
        throw new Error(`Chat context window limit exceeded (${MAX_CONTEXT_WINDOW} characters). Please refresh chat to start a new conversation.`)
    }

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