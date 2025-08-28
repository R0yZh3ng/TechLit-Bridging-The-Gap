import React, { useState } from 'react'
import { Shield, Mail, MessageSquare, Phone, Globe, BookOpen, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import axios from 'axios'

// API configuration
const API_BASE_URL = 'http://localhost:5000/api'

// Types
interface AnalysisResult {
  is_scam: boolean
  risk_score: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  reasons: string[]
  recommendations: string[]
  source_credibility: {
    score: number
    factors: string[]
  }
}

interface ApiResponse {
  success: boolean
  analysis_type: string
  timestamp: string
  result: AnalysisResult
}

type TabType = 'dashboard' | 'email' | 'text' | 'call' | 'website' | 'education'

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'email', label: 'Email Analysis', icon: Mail },
    { id: 'text', label: 'Text Analysis', icon: MessageSquare },
    { id: 'call', label: 'Call Analysis', icon: Phone },
    { id: 'website', label: 'Website Analysis', icon: Globe },
    { id: 'education', label: 'Learn More', icon: BookOpen },
  ]

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'email':
        return <EmailAnalyzer onAnalyze={handleEmailAnalysis} />
      case 'text':
        return <TextAnalyzer onAnalyze={handleTextAnalysis} />
      case 'call':
        return <CallAnalyzer onAnalyze={handleCallAnalysis} />
      case 'website':
        return <WebsiteAnalyzer onAnalyze={handleWebsiteAnalysis} />
      case 'education':
        return <EducationalContent />
      default:
        return <Dashboard />
    }
  }

  // API Analysis Functions
  const handleEmailAnalysis = async (sender: string, subject: string, content: string) => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/analyze/email`, {
        sender,
        subject,
        content
      })
      
      if (response.data.success) {
        setAnalysisResult(response.data.result)
      } else {
        setError('Analysis failed')
      }
    } catch (err) {
      setError('Failed to connect to analysis service')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleTextAnalysis = async (senderNumber: string, content: string) => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/analyze/text`, {
        sender_number: senderNumber,
        content
      })
      
      if (response.data.success) {
        setAnalysisResult(response.data.result)
      } else {
        setError('Analysis failed')
      }
    } catch (err) {
      setError('Failed to connect to analysis service')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCallAnalysis = async (callerNumber: string, callDetails: string) => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/analyze/call`, {
        caller_number: callerNumber,
        call_details: callDetails
      })
      
      if (response.data.success) {
        setAnalysisResult(response.data.result)
      } else {
        setError('Analysis failed')
      }
    } catch (err) {
      setError('Failed to connect to analysis service')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleWebsiteAnalysis = async (url: string, additionalDetails: string) => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const response = await axios.post<ApiResponse>(`${API_BASE_URL}/analyze/website`, {
        url,
        additional_details: additionalDetails
      })
      
      if (response.data.success) {
        setAnalysisResult(response.data.result)
      } else {
        setError('Analysis failed')
      }
    } catch (err) {
      setError('Failed to connect to analysis service')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ScamGuard</h1>
                <p className="text-sm text-gray-600">AI-Powered Scam Detection</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-800 rounded-lg">
                <AlertTriangle size={16} />
                <span className="text-sm font-medium">Emergency: 911</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Main Content */}
        <main className="space-y-8">
          {renderActiveTab()}
        </main>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-8 card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(analysisResult.risk_level)}`}>
                {analysisResult.risk_level.toUpperCase()} RISK
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Risk Assessment</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Scam Probability:</span>
                    <span className={`font-semibold ${analysisResult.is_scam ? 'text-red-600' : 'text-green-600'}`}>
                      {analysisResult.is_scam ? 'HIGH' : 'LOW'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Risk Score:</span>
                    <span className="font-semibold text-gray-900">{analysisResult.risk_score}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-semibold text-gray-900">{analysisResult.confidence}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Source Credibility</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Credibility Score:</span>
                    <span className={`font-semibold ${
                      analysisResult.source_credibility.score > 70 ? 'text-green-600' :
                      analysisResult.source_credibility.score > 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {analysisResult.source_credibility.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        analysisResult.source_credibility.score > 70 ? 'bg-green-500' :
                        analysisResult.source_credibility.score > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${analysisResult.source_credibility.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Red Flags Detected
                </h4>
                <ul className="space-y-2">
                  {analysisResult.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Credibility Factors
                </h4>
                <ul className="space-y-2">
                  {analysisResult.source_credibility.factors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Error: {error}</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Please check your connection and try again. Make sure the backend server is running.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Dashboard Component
const Dashboard: React.FC = () => (
  <div className="space-y-6">
    <div className="card">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to ScamGuard</h2>
      <p className="text-lg text-gray-600">
        Your AI-powered shield against scams, fraud, and illegitimate communications. 
        Use our advanced analysis tools to detect potential threats in emails, texts, calls, and websites.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card text-center">
        <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">Email Analysis</h3>
        <p className="text-sm text-gray-600">Detect phishing attempts and suspicious emails</p>
      </div>
      <div className="card text-center">
        <MessageSquare className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">Text Analysis</h3>
        <p className="text-sm text-gray-600">Identify scam SMS and messaging threats</p>
      </div>
      <div className="card text-center">
        <Phone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">Call Analysis</h3>
        <p className="text-sm text-gray-600">Screen suspicious calls and robocalls</p>
      </div>
      <div className="card text-center">
        <Globe className="w-12 h-12 text-orange-600 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">Website Analysis</h3>
        <p className="text-sm text-gray-600">Verify website legitimacy and security</p>
      </div>
    </div>
  </div>
)

// Email Analyzer Component
const EmailAnalyzer: React.FC<{ onAnalyze: (sender: string, subject: string, content: string) => void }> = ({ onAnalyze }) => {
  const [sender, setSender] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAnalyze(sender, subject, content)
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Mail className="w-6 h-6 text-blue-600" />
        Email Scam Analysis
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sender Email</label>
          <input
            type="email"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="sender@example.com"
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste email content here..."
            rows={6}
            className="input-field"
          />
        </div>
        
        <button type="submit" className="btn-primary w-full">
          Analyze Email
        </button>
      </form>
    </div>
  )
}

// Text Analyzer Component
const TextAnalyzer: React.FC<{ onAnalyze: (senderNumber: string, content: string) => void }> = ({ onAnalyze }) => {
  const [senderNumber, setSenderNumber] = useState('')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAnalyze(senderNumber, content)
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-green-600" />
        Text Message Analysis
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sender Number</label>
          <input
            type="tel"
            value={senderNumber}
            onChange={(e) => setSenderNumber(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste text message content here..."
            rows={6}
            className="input-field"
          />
        </div>
        
        <button type="submit" className="btn-primary w-full">
          Analyze Text Message
        </button>
      </form>
    </div>
  )
}

// Call Analyzer Component
const CallAnalyzer: React.FC<{ onAnalyze: (callerNumber: string, callDetails: string) => void }> = ({ onAnalyze }) => {
  const [callerNumber, setCallerNumber] = useState('')
  const [callDetails, setCallDetails] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAnalyze(callerNumber, callDetails)
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Phone className="w-6 h-6 text-purple-600" />
        Phone Call Analysis
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Caller Number</label>
          <input
            type="tel"
            value={callerNumber}
            onChange={(e) => setCallerNumber(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Call Details</label>
          <textarea
            value={callDetails}
            onChange={(e) => setCallDetails(e.target.value)}
            placeholder="Describe what the caller said, any requests made, etc..."
            rows={6}
            className="input-field"
          />
        </div>
        
        <button type="submit" className="btn-primary w-full">
          Analyze Phone Call
        </button>
      </form>
    </div>
  )
}

// Website Analyzer Component
const WebsiteAnalyzer: React.FC<{ onAnalyze: (url: string, additionalDetails: string) => void }> = ({ onAnalyze }) => {
  const [url, setUrl] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAnalyze(url, additionalDetails)
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Globe className="w-6 h-6 text-orange-600" />
        Website Analysis
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
          <textarea
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            placeholder="Describe any suspicious behavior, requests, or concerns..."
            rows={6}
            className="input-field"
          />
        </div>
        
        <button type="submit" className="btn-primary w-full">
          Analyze Website
        </button>
      </form>
    </div>
  )
}

// Educational Content Component
const EducationalContent: React.FC = () => (
  <div className="space-y-6">
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-blue-600" />
        Scam Prevention Education
      </h2>
      <p className="text-gray-600">
        Learn about different types of scams and how to protect yourself.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Common Scam Types</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Phishing emails</li>
          <li>• Robocalls</li>
          <li>• Fake websites</li>
          <li>• Text message scams</li>
          <li>• Social media fraud</li>
        </ul>
      </div>
      
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Protection Tips</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Never share personal information</li>
          <li>• Verify sources independently</li>
          <li>• Be suspicious of urgent requests</li>
          <li>• Use strong passwords</li>
          <li>• Keep software updated</li>
        </ul>
      </div>
    </div>
  </div>
)

export default App
