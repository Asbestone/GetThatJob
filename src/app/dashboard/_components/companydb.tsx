'use client'

import React, { useState, useEffect } from 'react';
import { Badge } from '@/app/components/frontend/ui/badge';
import { Button } from '@/app/components/frontend/ui/button';

interface CompanyInsights {
  skills: string[];
  prev_exp: string[];
  education: string[];
  tech_stack: string[];
  project_themes: string[];
}

export default function CompanyDB() {
  const [companies, setCompanies] = useState<string[]>([])
  const [companyInsights, setCompanyInsights] = useState<CompanyInsights | string | null>(null)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)
  const [errorInsights, setErrorInsights] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalCompanyName, setModalCompanyName] = useState<string>('')

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

  const openModal = async (company: string) => {
    setShowModal(true)
    setModalCompanyName(company)
    setCompanyInsights(null)
    setIsLoadingInsights(true)
    setErrorInsights(null)

    try {
      const response = await fetch(`/api/companies-data/single-company-data?company=${encodeURIComponent(company)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      // Check if the insights are a string or a JSON object
      if (typeof data.insights === 'string') {
        setCompanyInsights(data.insights)
      } else {
        setCompanyInsights(data.insights as CompanyInsights)
      }
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
    setModalCompanyName('')
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
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-lg"></div>
            <div className="relative bg-white p-8 rounded-2xl shadow-2xl z-10 w-2/3 max-w-2xl max-h-3/4 overflow-auto">
              
              <h2 className="text-2xl font-bold text-black mb-4">
                Insights for {modalCompanyName}
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
                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-gray-800">
                  {typeof companyInsights === 'string' ? (
                    <p>{companyInsights}</p>
                  ) : (
                    companyInsights && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Key Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {companyInsights.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Common Job Titles</h4>
                          <div className="flex flex-wrap gap-2">
                            {companyInsights.prev_exp.map((title, index) => (
                              <Badge key={index} variant="outline">{title}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Education Trends</h4>
                          <p className="text-sm">{companyInsights.education.join(', ')}</p>
                        </div>
                        
                         <div>
                          <h4 className="font-semibold mb-2">Common Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {companyInsights.tech_stack.map((tech, index) => (
                              <Badge key={index} variant="secondary">{tech}</Badge>
                            ))}
                          </div>
                        </div>
                        
                         <div>
                          <h4 className="font-semibold mb-2">Project Themes</h4>
                          <div className="flex flex-wrap gap-2">
                            {companyInsights.project_themes.map((theme, index) => (
                              <Badge key={index} variant="outline">{theme}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              <Button
                onClick={closeModal}
                className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </Button>
            </div>
          </div>
      )}
    </div>
  );
}
