import { CohereClient } from "cohere-ai";
import {
  ResumeData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
} from "../types/resume";

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

export class CohereService {
  private client: CohereClient;

  constructor() {
    this.client = cohere;
  }

  /**
   * Generate embeddings for resume text using Cohere's embed-english-v3.0 model
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.embed({
        texts: [text],
        model: "embed-english-v3.0",
        inputType: "search_document",
      });

      if (
        response.embeddings &&
        Array.isArray(response.embeddings) &&
        response.embeddings.length > 0
      ) {
        return response.embeddings[0] as number[];
      }

      throw new Error("No embeddings returned from Cohere");
    } catch (error) {
      console.error("Error generating embeddings:", error);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await this.client.embed({
        texts: texts,
        model: "embed-english-v3.0",
        inputType: "search_document",
      });

      if (
        response.embeddings &&
        Array.isArray(response.embeddings) &&
        response.embeddings.length > 0
      ) {
        return response.embeddings as number[][];
      }

      throw new Error("No embeddings returned from Cohere");
    } catch (error) {
      console.error("Error generating batch embeddings:", error);
      throw error;
    }
  }

  /**
   * Generate query embedding for search operations
   */
  async generateQueryEmbedding(query: string): Promise<number[]> {
    try {
      const response = await this.client.embed({
        texts: [query],
        model: "embed-english-v3.0",
        inputType: "search_query",
      });

      if (
        response.embeddings &&
        Array.isArray(response.embeddings) &&
        response.embeddings.length > 0
      ) {
        return response.embeddings[0] as number[];
      }

      throw new Error("No embeddings returned from Cohere");
    } catch (error) {
      console.error("Error generating query embedding:", error);
      throw error;
    }
  }

  /**
   * Prepare resume text for vectorization by combining all relevant fields
   */
  prepareResumeText(resumeData: ResumeData): string {
    const textParts: string[] = [];

    // Add name and contact info
    if (resumeData.name) textParts.push(`Name: ${resumeData.name}`);
    if (resumeData.email) textParts.push(`Email: ${resumeData.email}`);

    // Add summary/objective
    if (resumeData.summary) textParts.push(`Summary: ${resumeData.summary}`);

    // Add skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      // Handle both array and string formats for skills
      let skillsString: string;
      if (Array.isArray(resumeData.skills)) {
        skillsString = resumeData.skills.join(", ");
      } else if (typeof resumeData.skills === "string") {
        skillsString = resumeData.skills;
      } else {
        skillsString = String(resumeData.skills);
      }
      textParts.push(`Skills: ${skillsString}`);
    }

    // Add experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      const experienceTexts = resumeData.experience.map(
        (exp: ExperienceItem) => {
          const parts: string[] = [];
          if (exp.title) parts.push(exp.title);
          if (exp.company) parts.push(`at ${exp.company}`);
          if (exp.duration) parts.push(`(${exp.duration})`);
          if (exp.description) parts.push(`: ${exp.description}`);
          return parts.join(" ");
        }
      );
      textParts.push(`Experience: ${experienceTexts.join(". ")}`);
    }

    // Add education
    if (resumeData.education && resumeData.education.length > 0) {
      const educationTexts = resumeData.education.map((edu: EducationItem) => {
        const parts: string[] = [];
        if (edu.degree) parts.push(edu.degree);
        if (edu.school) parts.push(`from ${edu.school}`);
        if (edu.year) parts.push(`(${edu.year})`);
        return parts.join(" ");
      });
      textParts.push(`Education: ${educationTexts.join(". ")}`);
    }

    // Add projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      const projectTexts = resumeData.projects.map((proj: ProjectItem) => {
        const parts: string[] = [];
        if (proj.name) parts.push(proj.name);
        if (proj.description) parts.push(`: ${proj.description}`);
        if (proj.technologies) {
          // Handle both array and string formats for technologies
          let techString: string;
          if (Array.isArray(proj.technologies)) {
            techString = proj.technologies.join(", ");
          } else if (typeof proj.technologies === "string") {
            techString = proj.technologies;
          } else {
            techString = String(proj.technologies);
          }
          parts.push(`Technologies: ${techString}`);
        }
        return parts.join(" ");
      });
      textParts.push(`Projects: ${projectTexts.join(". ")}`);
    }

    return textParts.join("\n\n");
  }

  /**
   * Extract key features from resume data for metadata
   */
  extractResumeFeatures(resumeData: ResumeData): {
    skills: string[];
    experience_years: number;
    education_level: string;
    job_titles: string[];
    companies: string[];
  } {
    // Handle skills - ensure it's always an array
    let skills: string[] = [];
    if (resumeData.skills) {
      if (Array.isArray(resumeData.skills)) {
        skills = resumeData.skills;
      } else if (typeof resumeData.skills === "string") {
        // Split by common delimiters
        skills = resumeData.skills
          .split(/[,;|]/)
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    }

    // Calculate total experience years
    let experience_years = 0;
    if (resumeData.experience && resumeData.experience.length > 0) {
      experience_years = resumeData.experience.reduce(
        (total: number, exp: ExperienceItem) => {
          if (exp.years) return total + parseFloat(exp.years.toString());
          if (exp.duration) {
            // Simple parsing for duration like "2 years", "6 months"
            const match = exp.duration.match(/(\d+)\s*(year|yr)/i);
            if (match) return total + parseFloat(match[1]);
            const monthMatch = exp.duration.match(/(\d+)\s*(month|mo)/i);
            if (monthMatch) return total + parseFloat(monthMatch[1]) / 12;
          }
          return total + 1; // Default to 1 year if can't parse
        },
        0
      );
    }

    // Determine education level
    let education_level = "High School";
    if (resumeData.education && resumeData.education.length > 0) {
      const degrees = resumeData.education.map(
        (edu: EducationItem) => edu.degree?.toLowerCase() || ""
      );
      if (
        degrees.some(
          (d: string) => d.includes("phd") || d.includes("doctorate")
        )
      ) {
        education_level = "PhD";
      } else if (
        degrees.some(
          (d: string) =>
            d.includes("master") || d.includes("ms") || d.includes("mba")
        )
      ) {
        education_level = "Masters";
      } else if (
        degrees.some(
          (d: string) =>
            d.includes("bachelor") || d.includes("bs") || d.includes("ba")
        )
      ) {
        education_level = "Bachelors";
      } else if (degrees.some((d: string) => d.includes("associate"))) {
        education_level = "Associates";
      }
    }

    // Extract job titles
    const job_titles: string[] = resumeData.experience
      ? (resumeData.experience
          .map((exp: ExperienceItem) => exp.title)
          .filter(Boolean) as string[])
      : [];

    // Extract companies
    const companies: string[] = resumeData.experience
      ? (resumeData.experience
          .map((exp: ExperienceItem) => exp.company)
          .filter(Boolean) as string[])
      : [];

    return {
      skills,
      experience_years,
      education_level,
      job_titles,
      companies,
    };
  }
}

export const cohereService = new CohereService();
