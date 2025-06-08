// Types for resume data structures
export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: string[] | string;
  experience?: ExperienceItem[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  certifications?: string[];
  languages?: string[];
  [key: string]: unknown;
}

export interface ExperienceItem {
  title?: string;
  company?: string;
  duration?: string;
  years?: number;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export interface EducationItem {
  degree?: string;
  school?: string;
  year?: string;
  gpa?: string;
  major?: string;
  location?: string;
}

export interface ProjectItem {
  name?: string;
  description?: string;
  technologies?: string[] | string;
  url?: string;
  duration?: string;
}

// Vector database types
export interface ResumeVector {
  id: string;
  user_id: string;
  resume_text: string;
  skills: string[];
  experience_years: number;
  education_level: string;
  job_titles: string[];
  companies: string[];
  target_company: string;
  created_at: string;
  vector: number[];
}

export interface SearchResult {
  id: string;
  user_id: string;
  resume_text: string;
  skills: string[];
  experience_years: number;
  education_level: string;
  job_titles: string[];
  companies: string[];
  target_company: string;
  created_at: string;
  distance?: number;
  score?: number;
}

// API response types
export interface VectorizeResponse {
  success: boolean;
  resumeId: string;
  vectorDimension: number;
  features: {
    skills: string[];
    experience_years: number;
    education_level: string;
    job_titles: string[];
    companies: string[];
  };
  message: string;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  targetCompany?: string;
  results: SearchResult[];
  count: number;
}

export interface ResumeListResponse {
  success: boolean;
  resumes: SearchResult[];
  count: number;
}

// Configuration types
export interface ZillizConfig {
  endpoint: string;
  token: string;
  collectionName: string;
  vectorDim: number;
}

export interface CohereConfig {
  apiKey: string;
  model: string;
  inputType: "search_document" | "search_query";
}
