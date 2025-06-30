"use client";

import React, { useState } from "react";

interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
  [key: string]: any;
}

interface VectorizeResult {
  success: boolean;
  message: string;
  resumeId?: string;
  error?: string;
}

interface SearchResultItem {
  id: string;
  score: number;
  target_company: string;
  experience_years: number;
  user_id: string;
  resume_text: string;
  skills: string;
  education_level: string;
  job_titles: string;
  companies: string;
  created_at: string;
}

interface CompareResult {
  success: boolean;
  message?: string;
  error?: string;
  results?: SearchResultItem[];
}

function DevResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [compareFile, setCompareFile] = useState<File | null>(null);
  const [parsedContent, setParsedContent] = useState<ParsedResume | null>(null);
  const [comparedContent, setComparedContent] = useState<ParsedResume | null>(
    null
  );
  const [targetCompany, setTargetCompany] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [vectorizeResult, setVectorizeResult] =
    useState<VectorizeResult | null>(null);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(
    null
  );

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isCompareFile = false
  ) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (isCompareFile) {
        setCompareFile(selectedFile);
        processFile(selectedFile, true);
      } else {
        setFile(selectedFile);
        processFile(selectedFile, false);
      }
    }
  };

  const processFile = async (selectedFile: File, isCompareFile = false) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append("filepond", selectedFile);

    try {
      // Step 1: Parse the resume
      console.log(
        `📄 Processing ${isCompareFile ? "comparison" : "main"} file: ${
          selectedFile.name
        }`
      );

      const response = await fetch("/api/resumeparser", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Parser error: ${response.statusText}`);
      }

      const rawResult = await response.json();

      // Step 2: Clean and extract features
      console.log(`🧹 Cleaning parsed content...`);

      const cleanedResponse = await fetch("/api/cleanparsed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rawText: rawResult.parsedText,
          devMode: true, // Enable dev mode
        }),
      });

      const result = await cleanedResponse.json();

      if (result.error) {
        throw new Error(result.error);
      }

      // Parse the cleaned JSON
      let rawParsedJSON = result.cleanedText;
      rawParsedJSON = rawParsedJSON
        .trim()
        .replace(/^```json\s*/, "")
        .replace(/```$/, "")
        .trim();

      const parsedResume = JSON.parse(rawParsedJSON);

      if (isCompareFile) {
        setComparedContent(parsedResume);
        console.log(`✅ Comparison file processed successfully`);
      } else {
        setParsedContent(parsedResume);
        console.log(`✅ Main file processed successfully`);
      }
    } catch (error) {
      console.error(
        `❌ Error processing ${isCompareFile ? "comparison" : "main"} file:`,
        error
      );
      alert(
        `Error processing file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const vectorizeAndUpload = async () => {
    if (!parsedContent) {
      alert("Please upload and process a resume first");
      return;
    }

    if (!targetCompany.trim()) {
      alert("Please enter a target company");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("🚀 Starting vectorization and upload...");

      const vectorizeResponse = await fetch("/api/vectorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData: parsedContent,
          targetCompany: targetCompany.trim(),
          userId: `dev-user-${Date.now()}`, // Generate a dev user ID
        }),
      });

      const result: VectorizeResult = await vectorizeResponse.json();
      setVectorizeResult(result);

      if (result.success) {
        console.log("✅ Resume vectorized and uploaded successfully!");
        console.log("📝 Resume ID:", result.resumeId);
        alert(
          `Success! Resume uploaded to Zilliz Cloud\nResume ID: ${result.resumeId}`
        );
      } else {
        console.error("❌ Vectorization failed:", result.error);
        alert(`Error: ${result.error || result.message}`);
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const compareResumes = async () => {
    if (!comparedContent) {
      alert("Please upload comparison resume first");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("🔍 Comparing resumes...");

      const searchResponse = await fetch("/api/search-resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData: comparedContent,
          targetCompany: targetCompany.trim() || undefined,
          limit: 5,
          devMode: true, // Enable dev mode for search
        }),
      });

      const result = await searchResponse.json();
      setCompareResult(result);

      if (result.success) {
        console.log("✅ Resume comparison completed!");
        console.log("📊 Similar resumes found:", result.results?.length || 0);
      } else {
        console.error("❌ Comparison failed:", result.error);
        alert(`Comparison failed: ${result.error || result.message}`);
      }
    } catch (error) {
      console.error("❌ Comparison error:", error);
      alert(
        `Comparison failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Development Mode - Resume Vectorization
        </h2>
        <p className="text-gray-600">
          Skip verification - directly upload vectorized resumes to Zilliz Cloud
        </p>
      </div>

      {/* Target Company Input */}
      <div className="mb-6">
        <label
          htmlFor="company"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Target Company (Required for vectorization)
        </label>
        <input
          id="company"
          type="text"
          value={targetCompany}
          onChange={(e) => setTargetCompany(e.target.value)}
          placeholder="e.g. Google, Microsoft, Meta, etc."
          className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Main Resume Upload */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            📄 Main Resume
          </h3>

          <label
            htmlFor="main-file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> main
                resume
              </p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 10MB)</p>
            </div>
          </label>
          <input
            id="main-file-upload"
            type="file"
            onChange={(e) => handleFileChange(e, false)}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />

          {file && (
            <div className="mt-4">
              <p className="text-sm text-gray-700">📎 {file.name}</p>
              {parsedContent && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700">
                    ✅ Parsed successfully
                  </p>
                  <p className="text-xs text-gray-600">
                    Name: {parsedContent.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-600">
                    Skills: {parsedContent.skills?.length || 0} found
                  </p>
                </div>
              )}
            </div>
          )}

          {parsedContent && (
            <div className="mt-4">
              <button
                onClick={vectorizeAndUpload}
                disabled={isProcessing || !targetCompany.trim()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isProcessing
                  ? "🔄 Processing..."
                  : "🚀 Vectorize & Upload to Zilliz"}
              </button>
            </div>
          )}
        </div>

        {/* Comparison Resume Upload */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🔍 Compare Resume
          </h3>

          <label
            htmlFor="compare-file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span>{" "}
                comparison resume
              </p>
              <p className="text-xs text-gray-500">
                Find similar resumes in database
              </p>
            </div>
          </label>
          <input
            id="compare-file-upload"
            type="file"
            onChange={(e) => handleFileChange(e, true)}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />

          {compareFile && (
            <div className="mt-4">
              <p className="text-sm text-gray-700">📎 {compareFile.name}</p>
              {comparedContent && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-700">
                    ✅ Ready for comparison
                  </p>
                  <p className="text-xs text-gray-600">
                    Name: {comparedContent.name || "N/A"}
                  </p>
                </div>
              )}
            </div>
          )}

          {comparedContent && (
            <div className="mt-4">
              <button
                onClick={compareResumes}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isProcessing ? "🔄 Searching..." : "🔍 Find Similar Resumes"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {(vectorizeResult || compareResult) && (
        <div className="mt-8 space-y-6">
          {vectorizeResult && (
            <div
              className={`p-4 rounded-lg ${
                vectorizeResult.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              } border`}
            >
              <h4 className="font-semibold text-lg mb-2">
                {vectorizeResult.success
                  ? "✅ Upload Result"
                  : "❌ Upload Failed"}
              </h4>
              <p className="text-sm text-gray-700">{vectorizeResult.message}</p>
              {vectorizeResult.resumeId && (
                <p className="text-xs text-gray-600 mt-1">
                  Resume ID: {vectorizeResult.resumeId}
                </p>
              )}
            </div>
          )}

          {compareResult && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-lg mb-2">
                🔍 Similar Resumes Found
              </h4>
              {compareResult.success ? (
                <div>
                  <p className="text-sm text-gray-700 mb-3">
                    Found {compareResult.results?.length || 0} similar resumes
                  </p>
                  {compareResult.results?.map(
                    (result: SearchResultItem, index: number) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded border mb-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">
                              Similarity Score:{" "}
                              {(result.score * 100).toFixed(1)}%
                            </p>
                            <p className="text-xs text-gray-600">
                              Company: {result.target_company}
                            </p>
                            <p className="text-xs text-gray-600">
                              Experience: {result.experience_years} years
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              ID: {result.id}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-red-700">
                  {compareResult.error || "Search failed"}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Parsed Content Preview */}
      {parsedContent && (
        <div className="mt-8">
          <details className="bg-gray-50 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer text-gray-800">
              📋 View Parsed Resume Data
            </summary>
            <pre className="mt-4 text-xs text-gray-700 overflow-auto max-h-64 bg-white p-3 rounded border">
              {JSON.stringify(parsedContent, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default DevResumeUpload;
