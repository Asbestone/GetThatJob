'use client'

import React, {useState} from 'react';

function ResumeUpload() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        } else {
            console.log("smth wrong with file, check function handleFileChange")
        }
    }

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
            </div>
    )
};

export default ResumeUpload;