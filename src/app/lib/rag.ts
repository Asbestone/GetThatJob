import { cohereService } from "./cohere";
import { zillizService } from "./zilliz";
import { extractCompany } from "./gemini";
import { GoogleGenAI, Content } from "@google/genai";
import fs from "fs";
import path from "path";

const MAX_CONTEXT_WINDOW = parseInt(process.env.MAX_CONTEXT_WINDOW || "5000")

// Simple in-memory session store for model history
// In production, we use Redis or a database
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

    // Get or create session ID
    const currentSessionId = sessionId || generateSessionId();
    
    // Get existing model history from session store for the LLM
    let modelHistoryForLLM = sessionStore.get(currentSessionId) || [];
    
    // If it's a new session for the LLM (modelHistoryForLLM is empty),
    // initialize it with the system prompt and the AI's initial greeting.
    if (modelHistoryForLLM.length === 0) {
        modelHistoryForLLM = [
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

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API })
    
    const chat = ai.chats.create({
        model: "gemini-2.0-flash-lite",
        history: modelHistoryForLLM, // Use the history from the session store for the LLM
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
        answer = "Sorry, I couldn't generate an answer based on the available data."
    }

    console.log("Current user message with context:", userMessageWithContext)
    console.log("Session ID:", currentSessionId)

    // --- START FIX: Ensure all messages in clientDisplayHistory have unique IDs ---
    interface ClientChatMessage {
        id: string;
        role: "user" | "model" | "system";
        parts: { text: string }[];
    }

    const clientDisplayHistory: ClientChatMessage[] = [];

    // Add the initial AI greeting to client history if it's the very first turn.
    // This is for display purposes only, not part of LLM's direct history.
    if (chatHistory.length === 0) {
        clientDisplayHistory.push({
            id: "initial-greeting", // This ID is already handled in ChatBox.tsx
            role: "model",
            parts: [{ text: "Hello! I'm here to assist you with resume analysis, job matching, and career-related questions. How can I help you today?" }]
        });
    }

    // Process existing chat history from the client (Content[] type)
    // Convert each Content to ClientChatMessage by assigning a unique ID.
    chatHistory.forEach((msg, index) => {
        // Generate a stable ID for historical messages.
        // Using a combination of index, role, and a snippet of text for better uniqueness.
        const textSnippet =
            Array.isArray(msg.parts) && msg.parts.length > 0 && typeof msg.parts[0]?.text === "string"
                ? msg.parts[0].text.substring(0, 15).replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
                : Date.now().toString();
        const historicalId = `hist-${msg.role}-${index}-${textSnippet}`;
        clientDisplayHistory.push({
            id: historicalId,
            role: msg.role as ClientChatMessage["role"], // Cast to ensure type compatibility
            parts: (msg.parts ?? []).map(part => ({ text: part.text || '' })) // Ensure parts have text property
        });
    });

    // Add the current user message and AI's response with unique IDs
    const userMessageId = `user-${Date.now()}`;
    const modelResponseId = `model-${Date.now() + 1}`; // Ensure it's different from user message ID

    clientDisplayHistory.push({
        id: userMessageId, // Assign unique ID
        role: "user",
        parts: [{ text: query }]
    });

    clientDisplayHistory.push({
        id: modelResponseId, // Assign unique ID
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
