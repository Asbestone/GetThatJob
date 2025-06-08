import { NextRequest, NextResponse } from "next/server";
import { zillizService } from "@/app/lib/zilliz";
import { cohereService } from "@/app/lib/cohere";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const {
      query,
      resumeData,
      targetCompany,
      limit = 10,
      devMode = false,
    } = await req.json();

    // Handle authentication - allow dev mode
    if (!devMode) {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (!token) {
        return NextResponse.json(
          { error: "Not authenticated" },
          { status: 401 }
        );
      }
    }

    // Determine query source - either text query or resume data
    let queryVector: number[];

    if (resumeData) {
      // Generate embedding from resume data for comparison
      const resumeText = cohereService.prepareResumeText(resumeData);
      queryVector = await cohereService.generateEmbedding(resumeText);
      console.log("🔍 Generated query vector from resume data");
    } else if (query) {
      // Generate embedding from text query
      queryVector = await cohereService.generateQueryEmbedding(query);
      console.log("🔍 Generated query vector from text query");
    } else {
      return NextResponse.json(
        { error: "Either query or resumeData is required" },
        { status: 400 }
      );
    }

    // Search for similar resumes
    const similarResumes = await zillizService.searchSimilarResumes(
      queryVector,
      targetCompany,
      limit
    );

    // Parse JSON fields back to objects if they are strings
    const processedResumes = similarResumes.map((resume) => ({
      ...resume,
      skills:
        typeof resume.skills === "string"
          ? JSON.parse(resume.skills || "[]")
          : resume.skills,
      job_titles:
        typeof resume.job_titles === "string"
          ? JSON.parse(resume.job_titles || "[]")
          : resume.job_titles,
      companies:
        typeof resume.companies === "string"
          ? JSON.parse(resume.companies || "[]")
          : resume.companies,
    }));

    return NextResponse.json({
      success: true,
      query: query,
      targetCompany: targetCompany,
      results: processedResumes,
      count: processedResumes.length,
    });
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
