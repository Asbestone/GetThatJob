import { MilvusClient, DataType, MetricType } from "@zilliz/milvus2-sdk-node";
import { SearchResult, ResumeVector } from "@/app/types/resume";

// Zilliz Cloud connection configuration
const getZillizClient = () => {
  const endpoint = process.env.ZILLIZ_ENDPOINT!;
  const token = process.env.ZILLIZ_TOKEN!;

  // Use the full HTTPS endpoint as it works correctly
  console.log("Connecting to Zilliz:", endpoint);

  return new MilvusClient({
    address: endpoint,
    token: token,
  });
};

const client = getZillizClient();

// Resume collection schema
const COLLECTION_NAME = "resume_vectors";
const VECTOR_DIM = 1024; // Cohere embed-english-v3.0 dimension

export const resumeCollectionSchema = {
  collection_name: COLLECTION_NAME,
  description: "Resume vector database for job matching",
  fields: [
    {
      name: "id",
      data_type: DataType.VarChar,
      max_length: 100,
      is_primary_key: true,
    },
    {
      name: "user_id",
      data_type: DataType.VarChar,
      max_length: 100,
    },
    {
      name: "resume_text",
      data_type: DataType.VarChar,
      max_length: 32768, // Large text field for resume content
    },
    {
      name: "skills",
      data_type: DataType.JSON,
    },
    {
      name: "experience_years",
      data_type: DataType.Float,
    },
    {
      name: "education_level",
      data_type: DataType.VarChar,
      max_length: 100,
    },
    {
      name: "job_titles",
      data_type: DataType.JSON,
    },
    {
      name: "companies",
      data_type: DataType.JSON,
    },
    {
      name: "target_company",
      data_type: DataType.VarChar,
      max_length: 100,
    },
    {
      name: "created_at",
      data_type: DataType.VarChar,
      max_length: 50,
    },
    {
      name: "vector",
      data_type: DataType.FloatVector,
      dim: VECTOR_DIM,
    },
  ],
};

// Index parameters for vector search
export const indexParams = {
  index_type: "IVF_FLAT",
  metric_type: MetricType.COSINE,
  params: { nlist: 1024 },
};

export class ZillizService {
  private client: MilvusClient;

  constructor() {
    this.client = client;
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log("Testing Zilliz connection...");
      const result = await this.client.listCollections();
      console.log("Zilliz connection successful:", result);
      return true;
    } catch (error) {
      console.error("Zilliz connection failed:", error);
      return false;
    }
  }

  async initializeCollection(): Promise<void> {
    try {
      // Test connection first
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error("Cannot connect to Zilliz Cloud");
      }

      // Check if collection exists
      const hasCollection = await this.client.hasCollection({
        collection_name: COLLECTION_NAME,
      });

      if (!hasCollection.value) {
        // Create collection
        await this.client.createCollection(resumeCollectionSchema);
        console.log(`Collection ${COLLECTION_NAME} created successfully`);

        // Create index
        await this.client.createIndex({
          collection_name: COLLECTION_NAME,
          field_name: "vector",
          ...indexParams,
        });
        console.log("Vector index created successfully");

        // Load collection
        await this.client.loadCollection({
          collection_name: COLLECTION_NAME,
        });
        console.log("Collection loaded successfully");
      } else {
        // Load existing collection
        await this.client.loadCollection({
          collection_name: COLLECTION_NAME,
        });
        console.log("Existing collection loaded successfully");
      }
    } catch (error) {
      console.error("Error initializing collection:", error);
      throw error;
    }
  }

  async insertResumeVector(data: {
    id: string;
    user_id: string;
    resume_text: string;
    skills: string[];
    experience_years: number;
    education_level: string;
    job_titles: string[];
    companies: string[];
    target_company: string;
    vector: number[];
  }): Promise<void> {
    try {
      await this.client.insert({
        collection_name: COLLECTION_NAME,
        data: [
          {
            id: data.id,
            user_id: data.user_id,
            resume_text: data.resume_text,
            skills: JSON.stringify(data.skills),
            experience_years: data.experience_years,
            education_level: data.education_level,
            job_titles: JSON.stringify(data.job_titles),
            companies: JSON.stringify(data.companies),
            target_company: data.target_company,
            created_at: new Date().toISOString(),
            vector: data.vector,
          },
        ],
      });
      console.log("Resume vector inserted successfully");
    } catch (error) {
      console.error("Error inserting resume vector:", error);
      throw error;
    }
  }

  async searchSimilarResumes(
    queryVector: number[],
    targetCompany?: string,
    limit: number = 10
  ): Promise<SearchResult[]> {
    try {
      const searchParams = {
        collection_name: COLLECTION_NAME,
        vector: queryVector,
        filter: targetCompany ? `target_company == "${targetCompany}"` : "",
        limit: limit,
        output_fields: [
          "id",
          "user_id",
          "resume_text",
          "skills",
          "experience_years",
          "education_level",
          "job_titles",
          "companies",
          "target_company",
          "created_at",
        ],
      };

      const results = await this.client.search(searchParams);
      return (results.results || []) as SearchResult[];
    } catch (error) {
      console.error("Error searching similar resumes:", error);
      throw error;
    }
  }

  async getResumesByUserId(userId: string): Promise<ResumeVector[]> {
    try {
      const results = await this.client.query({
        collection_name: COLLECTION_NAME,
        filter: `user_id == "${userId}"`,
        output_fields: [
          "id",
          "resume_text",
          "skills",
          "experience_years",
          "education_level",
          "job_titles",
          "companies",
          "target_company",
          "created_at",
        ],
      });
      return (results.data || []) as ResumeVector[];
    } catch (error) {
      console.error("Error getting resumes by user ID:", error);
      throw error;
    }
  }

  async deleteResumeVector(id: string): Promise<void> {
    try {
      await this.client.delete({
        collection_name: COLLECTION_NAME,
        filter: `id == "${id}"`,
      });
      console.log("Resume vector deleted successfully");
    } catch (error) {
      console.error("Error deleting resume vector:", error);
      throw error;
    }
  }

  async updateResumeTargetCompany(
    id: string,
    targetCompany: string
  ): Promise<void> {
    try {
      // Note: Milvus doesn't support direct updates, so we need to delete and re-insert
      // First, get the existing data
      const existingData = await this.client.query({
        collection_name: COLLECTION_NAME,
        filter: `id == "${id}"`,
        output_fields: [
          "user_id",
          "resume_text",
          "skills",
          "experience_years",
          "education_level",
          "job_titles",
          "companies",
          "vector",
        ],
      });

      if (!existingData.data || existingData.data.length === 0) {
        throw new Error("Resume not found");
      }

      const resume = existingData.data[0];

      // Delete the old record
      await this.client.delete({
        collection_name: COLLECTION_NAME,
        filter: `id == "${id}"`,
      });

      // Re-insert with updated target company
      await this.client.insert({
        collection_name: COLLECTION_NAME,
        data: [
          {
            id: id,
            user_id: resume.user_id,
            resume_text: resume.resume_text,
            skills: resume.skills,
            experience_years: resume.experience_years,
            education_level: resume.education_level,
            job_titles: resume.job_titles,
            companies: resume.companies,
            target_company: targetCompany,
            created_at: new Date().toISOString(),
            vector: resume.vector,
          },
        ],
      });

      console.log("Resume target company updated successfully");
    } catch (error) {
      console.error("Error updating resume target company:", error);
      throw error;
    }
  }

  async getCompanies(): Promise<string[]> {
    try {
      const results = await this.client.query({
        collection_name: COLLECTION_NAME,
        output_fields: ["target_company"],
        filter: 'target_company != ""',
      })

      const rawCompanies = (results.data || []).map((row: any) => row.target_company)
      
      //deduplicate and return
      const distinctCompanies = [...new Set(rawCompanies)].filter(Boolean)
      return distinctCompanies
    } catch (error) {
      console.error("Error fetching distinct companies: ", error)
      throw error;
    }
  }
}

export const zillizService = new ZillizService();
