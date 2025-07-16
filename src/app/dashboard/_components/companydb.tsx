'use client'

import React, { useState, useEffect } from 'react';

export default function CompanyDB() {
  const [companies, setCompanies] = useState<string[]>([])
  const [companyInsights, setCompanyInsights] = useState<string | null>(null)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [errorInsights, setErrorInsights] = useState<string | null>(null)
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
    setIsLoadingInsights(true)
    setErrorInsights(null)

    try {
      const response = await fetch(`/api/companies-data/single-company-data?company=${encodeURIComponent(company)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCompanyInsights(data.insights)
    } catch (error: any) {
      console.error("Error fetching company insights:", error)
      setErrorInsights(error.message || "Failed to load company insights.")
    } finally {
      setIsLoadingInsights(false)
    }

  }

  const closeModal = () => {
    setShowModal(false)
    setCompanyInsights(null)
    setIsLoadingInsights(false)
    setErrorInsights(null)
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
          <div className="absolute inset-0 backdrop-blur-lg"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-2xl z-10 w-2/3 max-w-2xl max-h-3/4 overflow-auto">
              
              <h2 className="text-2xl font-bold text-black mb-4">
                Insights
              </h2>

              {isLoadingInsights ? (
                <div className="flex justify-center items-center h-32">
                  {/* Simple loading spinner */}
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                  <p className="ml-4 text-gray-600">Loading insights...</p>
                </div>
              ) : errorInsights ? (
                <p className="text-red-600">Error: {errorInsights} 🚨</p>
              ) : (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-gray-800 whitespace-pre-wrap">
                  {companyInsights || "No insights available."}
                </div>
              )}

              <button
                onClick={closeModal}
                className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
      )}
    </div>
  );
}
