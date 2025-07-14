import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})

export async function generateAnswer(context: string, query: string): Promise<string> {
    
    const prompt = `
        Context:
        ${context}

        User Question:
        ${query}

        Answer based only on the context above.
    `

    const [result] = await Promise.all([
        ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: [
                {
                    role: "user",
                    parts: [{  text: prompt }],
                },
            ],
        })
    ])

    return result.text ?? ""
}