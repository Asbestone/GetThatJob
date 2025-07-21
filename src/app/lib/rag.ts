import { cohereService } from "./cohere";
import { zillizService } from "./zilliz";
import { extractCompany } from "./gemini";
import { GoogleGenAI, Content } from "@google/genai";
import fs from "fs";
import path from "path";

const MAX_CONTEXT_WINDOW = parseInt(process.env.MAX_CONTEXT_WINDOW || "5000")

export async function runRAG(query: string, chatHistory: Content[]) {
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

    // HANDLING CHAT SESSION

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API })
    
    // Build the complete model history
    let modelHistory: Content[] = [];
    
    // Always start with the system prompt as the first user message
    modelHistory.push({
        role: "user",
        parts: [{ text: prompt }]
    });
    
    // Add the AI's greeting response (this is hidden from user but needed for model consistency)
    modelHistory.push({
        role: "model",
        parts: [{ text: "Hello! I'm here to assist you with resume analysis, job matching, and career-related questions. How can I help you today?" }]
    });
    
    // Add the existing chat history (if any) - these are the actual user-model exchanges
    if (chatHistory.length > 0) {
        modelHistory.push(...chatHistory);
    }

    const chat = ai.chats.create({
        model: "gemini-2.0-flash-lite",
        history: modelHistory,
        config: {
            maxOutputTokens: 500
        }
    })

    // Prepare the current user message with context (this goes to the model only)
    let userMessageWithContext = `
        Retrieved Context:
        ${context}

        Target Company:
        ${targetCompany ? targetCompany : "No company"}

        User's Question:
        ${query}
    `

    if (userMessageWithContext.length > MAX_CONTEXT_WINDOW) {
        console.warn(`Server: Context window limit exceeded! Request rejected. Length: ${userMessageWithContext.length}. Limit: ${MAX_CONTEXT_WINDOW}`)
        throw new Error(`Chat context window limit exceeded (${MAX_CONTEXT_WINDOW} characters). Please refresh chat to start a new conversation.`)
    }

    let answer: string
    try {
        const response = await chat.sendMessage({ message: userMessageWithContext })
        answer = response.text ?? "Sorry, I couldn't generate an answer at this time."
    } catch (error) {
        console.error("Failed to generate answer:", error)
        answer = "Sorry, I couldn't generate an answer at this time."
    }

    console.log(userMessageWithContext)

    // FILTERING HISTORY FOR CLIENT
    // Build the client history by taking the existing chatHistory and adding the new exchange

    const clientDisplayHistory: Content[] = [...chatHistory]; // Start with existing history

    // Add the current user message (clean, without context)
    clientDisplayHistory.push({
        role: "user",
        parts: [{ text: query }]
    });

    // Add the AI's response
    clientDisplayHistory.push({
        role: "model",
        parts: [{ text: answer }]
    });

    return {
        results: similar,
        answer,
        targetCompany,
        updatedChatHistory: clientDisplayHistory
    }
}