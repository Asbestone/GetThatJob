"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Resume {
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
}

interface SearchResult {
  success: boolean;
  query: string;
  targetCompany?: string;
  results: Resume[];
  count: number;
}

const ResumeVectorManager: React.FC = () => {
  const { status } = useSession();
  const [userResumes, setUserResumes] = useState<Resume[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [searchResults, setSearchResults] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's resumes on component mount
  useEffect(() => {
    if (status === "authenticated") {
      loadUserResumes();
    }
  }, [status]);

  const loadUserResumes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vectorize", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setUserResumes(data.resumes || []);
      } else {
        setError("Failed to load resumes");
      }
    } catch (err) {
      setError("Error loading resumes");
      console.error("Error loading resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search query");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/search-resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          targetCompany: targetCompany || undefined,
          limit: 10,
        }),
      });

      if (response.ok) {
        const data: SearchResult = await response.json();
        setSearchResults(data.results);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Search failed");
      }
    } catch (err) {
      setError("Error performing search");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // TODO: Implement API endpoint for updating resume metadata
  // const updateTargetCompany = async (resumeId: string, company: string) => {
  //   console.log(`Updating resume ${resumeId} target company to ${company}`);
  // };

  if (status === "loading") {
    return <div className="p-8 text-black">Loading...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="p-8 text-black">
        Please log in to access resume management.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-black mb-8">
        Resume Vector Management
      </h1>

      {/* Search Section */}
      <div className="bg-white border rounded-lg p-6 mb-8 shadow-lg">
        <h2 className="text-xl font-semibold text-black mb-4">
          Search Similar Resumes
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="searchQuery"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Query (skills, job titles, experience)
            </label>
            <input
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., React developer with 3 years experience"
              className="w-full p-3 border border-gray-300 rounded-md text-black"
            />
          </div>

          <div>
            <label
              htmlFor="targetCompany"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Target Company (optional)
            </label>
            <input
              id="targetCompany"
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="e.g., Google, Microsoft, etc."
              className="w-full p-3 border border-gray-300 rounded-md text-black"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Resumes"}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white border rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold text-black mb-4">
            Search Results ({searchResults.length} found)
          </h2>

          <div className="space-y-4">
            {searchResults.map((resume, index) => (
              <div
                key={resume.id}
                className="border border-gray-200 rounded p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-black">
                    Resume #{index + 1}
                  </h3>
                  {resume.distance && (
                    <span className="text-sm text-gray-500">
                      Similarity: {(1 - resume.distance).toFixed(3)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <strong>Experience:</strong> {resume.experience_years} years
                  </div>
                  <div>
                    <strong>Education:</strong> {resume.education_level}
                  </div>
                  <div>
                    <strong>Target Company:</strong>{" "}
                    {resume.target_company || "Not specified"}
                  </div>
                  <div>
                    <strong>Created:</strong>{" "}
                    {new Date(resume.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-2">
                  <strong className="text-sm text-gray-700">Skills:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resume.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <strong className="text-sm text-gray-700">Job Titles:</strong>
                  <div className="text-sm text-gray-600">
                    {resume.job_titles.join(", ") || "None specified"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User's Resumes */}
      <div className="bg-white border rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">
            Your Vectorized Resumes
          </h2>
          <button
            onClick={loadUserResumes}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {userResumes.length === 0 ? (
          <p className="text-gray-600">
            No vectorized resumes found. Upload and process a resume to get
            started.
          </p>
        ) : (
          <div className="space-y-4">
            {userResumes.map((resume, index) => (
              <div
                key={resume.id}
                className="border border-gray-200 rounded p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-black">
                    Resume #{index + 1}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {new Date(resume.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-2">
                  <div>
                    <strong>Experience:</strong> {resume.experience_years} years
                  </div>
                  <div>
                    <strong>Education:</strong> {resume.education_level}
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Company:
                  </label>
                  <input
                    type="text"
                    value={resume.target_company}
                    onChange={(e) => {
                      // Update local state immediately
                      const updatedResumes = userResumes.map((r) =>
                        r.id === resume.id
                          ? { ...r, target_company: e.target.value }
                          : r
                      );
                      setUserResumes(updatedResumes);
                    }}
                    placeholder="Enter target company"
                    className="w-full p-2 border border-gray-300 rounded text-black text-sm"
                  />
                </div>

                <div className="mb-2">
                  <strong className="text-sm text-gray-700">Skills:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resume.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <strong className="text-sm text-gray-700">Companies:</strong>
                  <div className="text-sm text-gray-600">
                    {resume.companies.join(", ") || "None specified"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeVectorManager;
