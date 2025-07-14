import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API})

export async function generateAnswer(context: string, query: string): Promise<string> {
    console.log("gemini endpoint hit")

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
            contents: prompt
        })
    ])

    console.log(result)

    return result.text ?? ""
}