'use client'

import { parse } from 'path';
import React, {useState} from 'react';

function ResumeUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            setFile(selectedFile);
            parseFile(selectedFile);

        } else {
            console.log("smth wrong with file, check function handleFileChange")
        }
    }

    const parseFile = (selectedFile: File) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            setFileContent(reader.result as string);
        }
        reader.onerror = () => {
            console.log('Error reading file, look up parseFile');
        }

        reader.readAsText(selectedFile);
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

            {fileContent && (
                <div className="mt-4 w-full max-w-4xl overflow-y-auto" style={{ maxHeight: '60vh' }}>
                    <h3 className="text-xl">File Content:</h3>
                    <pre className="whitespace-pre-wrap break-words">{fileContent}</pre>
                </div>
            )}

            </div>
    )
};

export default ResumeUpload;