import { ZillizConfig, CohereConfig } from "@/app/types/resume";

// Environment validation
function validateEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}

// Zilliz Cloud configuration
export const zillizConfig: ZillizConfig = {
  endpoint: validateEnvVar("ZILLIZ_ENDPOINT", process.env.ZILLIZ_ENDPOINT),
  token: validateEnvVar("ZILLIZ_TOKEN", process.env.ZILLIZ_TOKEN),
  collectionName: "resume_vectors",
  vectorDim: 1024, // Cohere embed-english-v3.0 dimension
};

// Cohere configuration
export const cohereConfig: CohereConfig = {
  apiKey: validateEnvVar("COHERE_API_KEY", process.env.COHERE_API_KEY),
  model: "embed-english-v3.0",
  inputType: "search_document",
};

// Collection schema constants
export const COLLECTION_FIELDS = {
  ID: "id",
  USER_ID: "user_id",
  RESUME_TEXT: "resume_text",
  SKILLS: "skills",
  EXPERIENCE_YEARS: "experience_years",
  EDUCATION_LEVEL: "education_level",
  JOB_TITLES: "job_titles",
  COMPANIES: "companies",
  TARGET_COMPANY: "target_company",
  CREATED_AT: "created_at",
  VECTOR: "vector",
} as const;

// Search configuration
export const SEARCH_CONFIG = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_SIMILARITY_SCORE: 0.7,
} as const;

// Education level hierarchy for better matching
export const EDUCATION_LEVELS = {
  "High School": 1,
  Associates: 2,
  Bachelors: 3,
  Masters: 4,
  PhD: 5,
} as const;

export type EducationLevel = keyof typeof EDUCATION_LEVELS;
