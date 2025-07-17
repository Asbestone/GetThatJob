import { GoogleGenAI } from "@google/genai"
import fs from "fs"
import path from "path"
import { zillizService } from "./zilliz"

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API})

export async function generateAnswer(context: string, query: string): Promise<string> {
    //console.log("gemini endpoint hit")

    const prompt = `
        Context:
        ${context}

        User Question:
        ${query}

        Answer normally, but based only on the context above.
        Don't mention filler sentences about the context in your reponse.
        Example: "Based on the provided context...". DO NOT DO THIS.
        Just answer like a regular LLM, but based on the context.
    `

    const [result] = await Promise.all([
        ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt
        })
    ])

    //console.log(result)

    return result.text ?? ""
}

export async function extractCompany(query: string): Promise<string | undefined> {
    const promptPath = path.join(process.cwd(), 'src', 'app', 'prompts', 'extract-company-name.txt')
    const promptTemplate = fs.readFileSync(promptPath, "utf8")

    const companies = await zillizService.getCompanies()
    const companiesString = companies.join(", ")
    console.log(companiesString)

    const prompt = `${promptTemplate}
        Companies:\n
        ${companiesString}\n\n
        Query:\n
        ${query}`

    const [response] = await Promise.all([
        ai.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: prompt
        })
    ])

    let company: string | undefined = response.text ? response.text.trim() : "__NONE__";
    if (company === "__NONE__") company = undefined

    return company
}