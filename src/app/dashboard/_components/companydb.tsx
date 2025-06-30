'use client'

import React, { useState } from 'react';

const companies = [
  'Google', 'Apple', 'Amazon', 'Microsoft', 'Meta',
  'Intel', 'Nvidia', 'IBM', 'Oracle', 'Salesforce',
  'Jane Street', 'Two Sigma', 'Citadel', 'Hudson River Trading'
];

export default function CompanyDB() {
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-black mb-4">Company Dashboard</h1>
      <div className="flex flex-wrap">
        {companies.map((company) => (
          <button
            key={company}
            onClick={openModal}
            className="px-4 py-2 bg-blue-500 text-white rounded m-2 hover:bg-blue-600"
          >
            {company}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Overlay: translucent glass effect */}
          <div className="absolute inset-0 backdrop-blur-lg"></div>

          {/* Modal content: larger size */}
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl z-10 w-2/3 max-w-2xl max-h-3/4 overflow-auto">
            <h2 className="text-2xl font-bold text-black mb-4">INSIGHTS</h2>
            <button
              onClick={closeModal}
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
