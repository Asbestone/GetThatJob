import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { zillizService } from "./zilliz";

const apiKey = process.env.GEMINI_API;
if (!apiKey) {
  throw new Error("GEMINI_API environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });

// Cache the prompt template at module load time
const promptTemplatePath = path.join(
  process.cwd(),
  "src",
  "app",
  "prompts",
  "extract-company-name.txt"
);
let promptTemplate: string;
try {
  promptTemplate = fs.readFileSync(promptTemplatePath, "utf8");
} catch (e) {
  promptTemplate = "";
  console.error("Failed to load extract-company-name.txt:", e);
}

export async function generateAnswer(context: string): Promise<string> {
  //console.log("gemini endpoint hit")
  //console.log(context)
  const [result] = await Promise.all([
    ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: context,
    }),
  ]);
  //console.log(result)
  return result.text ?? "";
}

export async function extractCompany(
  query: string
): Promise<string | undefined> {
  const companies = await zillizService.getCompanies();
  const companiesString = companies.join(", ");

  const prompt = `${promptTemplate}
        Companies:\n
        ${companiesString}\n\n
        Query:\n
        ${query}`;

  const response = await generateAnswer(prompt);

  let company: string | undefined = undefined;
  if (
    response &&
    response.trim().length > 0 &&
    response.trim() !== "__NONE__"
  ) {
    company = response.trim();
  }
  return company;
}
