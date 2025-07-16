'use client'

import React, { useState, useEffect } from 'react';

export default function CompanyDB() {
  const [companies, setCompanies] = useState<string[]>([])
  const [companyInsights, setCompanyInsights] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchCompanies = async() => {
      try {
        const response = await fetch('/api/companies-data/total-companies')
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        const data = await response.json()
        setCompanies(data.companies)
      } catch (error: any) {
        console.error("Failed to fetch companies:", error)
      }
    }
    fetchCompanies()
  }, []) // run once on mount


  // FOR FETCHING COMPANY DATA AND DISPLAYING IT
  const openModal = async (company: string) => {
    setShowModal(true)
    setCompanyInsights(null)
    try {
      const response = await fetch(`/api/companies-data/single-company-data?company=${encodeURIComponent(company)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCompanyInsights(data.insights)
    } catch (error: any) {
      console.error("Error fetching company insights:", error)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setCompanyInsights(null)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-black mb-4">Company Dashboard</h1>
      <div className="flex flex-wrap">
        {companies.map((company) => (
          <button
            key={company}
            onClick={() => openModal(company)}
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
            <h2 className="text-2xl font-bold text-black mb-4">{companyInsights}</h2>
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
