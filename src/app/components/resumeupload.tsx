'use client'

import React, {useState} from 'react';

function ResumeUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
            sendFileToServer(selectedFile);
        } else {
            console.log("smth wrong with file, check function handleFileChange")
        }
    }

    const sendFileToServer = async (selectedFile: File) => {
        const formData = new FormData();
        formData.append("filepond", selectedFile);
    
        try {
          const response = await fetch("/api/resumeparser", {
            method: "POST",
            body: formData,
          });
    
          if (!response.ok) {
            console.error("Server responded with an error:", response.statusText);
            return;
          }

          const rawResult = await response.json();

          const cleanedResponse = await fetch("/api/cleanparsed", {
            method: "POST",
            body: rawResult.parsedText,
          })

          const result = await cleanedResponse.json();
    
          if (result.error) {
            console.error("Error from server:", result.error);
          } else {

            let rawParsedJSON = result.cleanedText;
            rawParsedJSON = rawParsedJSON.trim().replace(/^```json\s*/, '').replace(/```$/, '').trim(); // removing the markdown comments

            let rawFeatureJSON = result.featureText;
            rawFeatureJSON = rawFeatureJSON.trim().replace(/^```json\s*/, '').replace(/```$/, '').trim();

            const cleanedParsedJSON = JSON.parse(rawParsedJSON);
            const cleanedFeatureJSON = JSON.parse(rawFeatureJSON);

            setFileContent(rawParsedJSON);

          }
        } catch (error) {
          console.error("Error sending file to server:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <label
                htmlFor="file-upload"
                className="p-4 mb-4 text-lg text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-400"
            >
                Choose a file
            </label>
            <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
            />

            {file && (
                <div className="mt-4">
                <p className="text-gray-700">File selected: {file.name}</p>
                </div>
            )}

            {fileContent && (
                <div className="mt-4 w-full max-w-4xl overflow-y-auto" style={{ maxHeight: '60vh' }}>
                    <h3 className="text-xl">File Content:</h3>
                    <pre className="whitespace-pre-wrap break-words text-black">{fileContent}</pre>
                </div>
            )}

        </div>
    )
};

export default ResumeUpload;