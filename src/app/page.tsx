'use client'

import Layout from '@/components/layout/Layout'
import { AnalyzeResponse } from '@/lib/graph/types'
import { useState } from 'react'

export default function Home() {
  const [contractCode, setContractCode] = useState('')
  const [contractAddress, setContractAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyzeContract = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_address: contractAddress,
          contract_text: contractCode
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze contract')
      }

      setResults(data.results)
    } catch (error) {
      console.error('Analysis failed:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text">
            Blockchain Asset Analyzer
          </h1>
          <p className="text-lg text-foreground/80">
            AI-powered Solana contract analysis using LangGraph
          </p>
        </header>

        <div className="input-area">
          <input
            type="text"
            className="w-full p-4 bg-background bg-opacity-50 border border-border rounded-lg"
            placeholder="Enter Solana contract address..."
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
          <div className="text-center text-foreground/60 my-2">OR</div>
          <textarea
            className="textarea-primary"
            placeholder="Paste your contract code here..."
            value={contractCode}
            onChange={(e) => setContractCode(e.target.value)}
          />
          <button
            className="button-primary w-full"
            disabled={!contractAddress && !contractCode || loading}
            onClick={analyzeContract}
          >
            {loading ? 'Analyzing...' : 'Analyze Contract'}
          </button>
        </div>

        {results && (
          <div className="results-area glass p-6 space-y-4">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <div className="flex items-center gap-2">
              <span>Security Score:</span>
              <span className="text-xl font-bold">{results.security_score}/100</span>
            </div>
            <div className="findings-list space-y-4">
              {results.findings.map((finding, index) => (
                <div key={index} className={`finding-card glass p-4 border-l-4 border-${finding.severity}`}>
                  <h3 className="font-bold">{finding.category}</h3>
                  <p className="text-foreground/80">{finding.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="glass p-4 border-l-4 border-error text-error">
            {error}
          </div>
        )}
      </div>
    </Layout>
  )
}
