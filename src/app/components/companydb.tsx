'use client'

import React, {useState} from 'react';

const companies = [
    'Google', 'Apple', 'Amazon', 'Microsoft', 'Meta',
    'Intel', 'Nvidia', 'IBM', 'Oracle', 'Salesforce',
    'Jane Street', 'Two Sigma', 'Citadel', 'Hudson River Trading'
];

function CompanyDB() {
    const [showInsights, setShowInsights] = useState(false);

    const openInsights = () => setShowInsights(true);
    const closeInsights = () => setShowInsights(false);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>
            <div className="flex flex-wrap">
                {companies.map((company) => (
                <button
                    key={company}
                    onClick={openInsights}
                    className="px-4 py-2 bg-blue-500 text-white rounded m-2 hover:bg-blue-600">
                    {company}
                </button>
                ))}
            </div>

            {showInsights && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* blur background */}
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>

                {/* Insights r here*/}
                <div className="bg-white p-6 rounded-lg shadow-lg z-10">
                    <h2 className="text-xl font-bold mb-4">INSIGHTS</h2>
                    <button
                    onClick={closeInsights}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                    Close
                    </button>
                </div>
                </div>
            )}
        </div>
    );
}

export default CompanyDB;