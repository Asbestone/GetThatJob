import { cohereService } from "./cohere";
import { zillizService } from "./zilliz";
import { extractCompany } from "./gemini";
import { GoogleGenAI, Content } from "@google/genai";
import fs from "fs";
import path from "path";

const MAX_CONTEXT_WINDOW = parseInt(process.env.MAX_CONTEXT_WINDOW || "5000")

// Simple in-memory session store for model history
// In production, you'd want to use Redis or a database
const sessionStore = new Map<string, Content[]>();

// Generate session ID (you can pass this from frontend or generate based on user ID)
function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function runRAG(query: string, chatHistory: Content[], sessionId?: string) {
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
    
    // Get or create session ID
    const currentSessionId = sessionId || generateSessionId();
    
    // Get existing model history from session store
    let modelHistory = sessionStore.get(currentSessionId) || [];
    
    // Initialize session if it's empty
    if (modelHistory.length === 0) {
        modelHistory = [
            {
                role: "user",
                parts: [{ text: prompt }]
            },
            {
                role: "model",
                parts: [{ text: "Hello! I'm here to assist you with resume analysis, job matching, and career-related questions. How can I help you today?" }]
            }
        ];
    }

    const chat = ai.chats.create({
        model: "gemini-2.0-flash-lite",
        history: modelHistory,
        config: {
            maxOutputTokens: 500
        }
    })

    // Prepare the current user message with context
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
        
        // Update the session store with the new model history (includes context)
        const updatedModelHistory = chat.getHistory();
        sessionStore.set(currentSessionId, updatedModelHistory);
        
        // Clean up old sessions (simple cleanup - keep last 100 sessions)
        if (sessionStore.size > 100) {
            const oldestKey = sessionStore.keys().next().value;
            if (typeof oldestKey === "string") {
                sessionStore.delete(oldestKey);
            }
        }
        
    } catch (error) {
        console.error("Failed to generate answer:", error)
        answer = "Sorry, I couldn't generate an answer at this time."
    }

    console.log("Current user message with context:", userMessageWithContext)
    console.log("Session ID:", currentSessionId)

    // FILTERING HISTORY FOR CLIENT
    // Build the client history by taking the existing chatHistory and adding the new exchange

    const clientDisplayHistory: Content[] = [...chatHistory]; // Start with existing clean history

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
        updatedChatHistory: clientDisplayHistory,
        sessionId: currentSessionId // Return session ID to frontend
    }
}

// Function to clear a specific session
export function clearSession(sessionId: string) {
    sessionStore.delete(sessionId);
}