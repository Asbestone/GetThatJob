import { NextRequest, NextResponse } from "next/server";
import { zillizService } from "@/app/lib/zilliz";
import { getToken } from "next-auth/jwt";

export async function PUT(req: NextRequest) {
  try {
    // Get user authentication
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { resumeId, targetCompany } = await req.json();

    if (!resumeId || !targetCompany) {
      return NextResponse.json(
        { error: "Resume ID and target company are required" },
        { status: 400 }
      );
    }

    // Update the resume's target company
    await zillizService.updateResumeTargetCompany(resumeId, targetCompany);

    return NextResponse.json({
      success: true,
      message: "Resume target company updated successfully",
      resumeId,
      targetCompany,
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
