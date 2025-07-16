import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { zillizService } from "../lib/zilliz";

import CompanyDB from "./_components/companydb";
import ResumeVectorManager from "./_components/resumevectormanager";
import DevResumeUpload from "./_components/devresumeupload";
import ChatBox from "./_components/chatbox";

const DEV_MODE = false;
const companies = await zillizService.getCompanies()

//server component so can use async and await
export default async function Home() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect('/login?callbackUrl=/dashboard');
    }

    //product code
    
    if (DEV_MODE) {
        return (
            <div className="w-full min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-black mb-2">GetThatJob</h1>
                        <div className="inline-block bg-yellow-100 border border-yellow-400 text-yellow-800 px-3 py-1 rounded-full text-sm">
                            🚧 Development Mode - No Auth Required
                        </div>
                    </div>

                    {/* Development Resume Upload Section */}
                    <div className="mb-12">
                        <DevResumeUpload />
                    </div>

                    {/* Vector Management Section */}
                    <div className="mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-2xl font-semibold text-black mb-4">
                            Vector Database Management
                        </h2>
                        <ResumeVectorManager />
                        </div>
                    </div>

                    {/* Development Info */}
                    <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-3">
                            🛠️ Development Mode Features
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-2">
                        <li>
                            ✅ <strong>Skip Authentication:</strong> No LinkedIn login
                            required
                        </li>
                        <li>
                            ✅ <strong>Direct Vectorization:</strong> Upload resumes
                            directly to Zilliz Cloud
                        </li>
                        <li>
                            ✅ <strong>Resume Comparison:</strong> Upload a second resume to
                            find similar ones
                        </li>
                        <li>
                            ✅ <strong>Auto-generated User IDs:</strong> Uses
                            timestamp-based dev user IDs
                        </li>
                        <li>
                            ✅ <strong>Full Vector Pipeline:</strong> Parse → Clean →
                            Vectorize → Store → Search
                        </li>
                        </ul>

                        <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                            <h4 className="font-medium text-blue-800 mb-2">
                                📊 Current Vector Database Status
                            </h4>
                        <p className="text-xs text-blue-600">
                            Connected to: Zilliz Cloud
                            <br />
                            Embedding Model: Cohere embed-english-v3.0 (1024 dimensions)
                            <br />
                            Collection: resume_vectors
                        </p>
                    </div>
                </div>
            </div>
        </div>
        );
    }

    // Production mode with authentication
    return (
        <div className="w-full min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-center text-black mb-8">
                    GetThatJob
                </h1>

                {/* Resume Upload Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-black mb-4">
                        Upload & Process Resume
                    </h2>
                    <DevResumeUpload />
                </div>

                {/* Vector Management Section */}
                <div className="mb-8">
                    <ResumeVectorManager />
                </div>

                {/* Company Database Section */}
                <div className="mb-8">
                    <CompanyDB companies={companies} />
                </div>

                {/* RAG Chat Interface */}
                <div className="mb-8">
                    <ChatBox />
                </div>

            </div>
        </div>
    );
}