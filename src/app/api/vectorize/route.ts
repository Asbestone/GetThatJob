import { NextRequest, NextResponse } from "next/server";
import { zillizService } from "@/app/lib/zilliz";
import { cohereService } from "@/app/lib/cohere";
import { getToken } from "next-auth/jwt";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { resumeData, targetCompany, userId } = await req.json();

    if (!resumeData) {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 }
      );
    }

    // Handle authentication - allow dev mode with provided userId
    let finalUserId: string;

    if (userId && userId.startsWith("dev-user-")) {
      // Development mode - use provided userId
      finalUserId = userId;
      console.log("🚧 Development mode - using provided userId:", finalUserId);
    } else {
      // Production mode - require authentication
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
      finalUserId = token.sub as string;
    }

    // Initialize Zilliz collection if needed
    await zillizService.initializeCollection();

    // Prepare resume text for vectorization
    const resumeText = cohereService.prepareResumeText(resumeData);

    // Extract features from resume
    const features = cohereService.extractResumeFeatures(resumeData);

    // Generate vector embedding
    const vector = await cohereService.generateEmbedding(resumeText);

    // Create unique ID for this resume
    const resumeId = uuidv4();

    // Store in Zilliz
    await zillizService.insertResumeVector({
      id: resumeId,
      user_id: finalUserId,
      resume_text: resumeText,
      skills: features.skills,
      experience_years: features.experience_years,
      education_level: features.education_level,
      job_titles: features.job_titles,
      companies: features.companies,
      target_company: targetCompany || "",
      vector: vector,
    });

    console.log("Resume vectorized and stored successfully");

    return NextResponse.json({
      success: true,
      resumeId: resumeId,
      vectorDimension: vector.length,
      features: features,
      message: "Resume successfully vectorized and stored in Zilliz Cloud",
    });
  } catch (error) {
    console.error("Error in vectorize API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get user authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user's resumes
    const resumes = await zillizService.getResumesByUserId(token.sub as string);

    return NextResponse.json({
      success: true,
      resumes: resumes,
      count: resumes.length,
    });
  } catch (error) {
    console.error("Error in vectorize GET API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
