import React, { useState } from 'react';
import { Shield, Mail, MessageSquare, Phone, Globe, BookOpen, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

interface AnalysisResult {
  risk_level: string;
  risk_score: number;
  warnings: string[];
  recommendations: string[];
  source_credibility: string;
  timestamp: string;
}

interface ApiResponse {
  data?: AnalysisResult;
  error?: string;
}

interface EmailData {
  sender: string;
  subject: string;
  content: string;
}

interface TextData {
  content: string;
  sender_number?: string;
}

interface CallData {
  caller_number: string;
  call_type: string;
  urgency_level: string;
}

interface WebsiteData {
  url: string;
  content: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAnalysis = async (emailData: EmailData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/api/analyze/email', emailData);
      if (response.data.error) {
        setError(response.data.error);
      } else if (response.data.data) {
        setAnalysisResult(response.data.data);
      }
    } catch (err) {
      setError('Failed to analyze email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextAnalysis = async (textData: TextData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/api/analyze/text', textData);
      if (response.data.error) {
        setError(response.data.error);
      } else if (response.data.data) {
        setAnalysisResult(response.data.data);
      }
    } catch (err) {
      setError('Failed to analyze text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallAnalysis = async (callData: CallData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/api/analyze/call', callData);
      if (response.data.error) {
        setError(response.data.error);
      } else if (response.data.data) {
        setAnalysisResult(response.data.data);
      }
    } catch (err) {
      setError('Failed to analyze call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebsiteAnalysis = async (websiteData: WebsiteData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/api/analyze/website', websiteData);
      if (response.data.error) {
        setError(response.data.error);
      } else if (response.data.data) {
        setAnalysisResult(response.data.data);
      }
    } catch (err) {
      setError('Failed to analyze website. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toUpperCase()) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toUpperCase()) {
      case 'HIGH': return <XCircle className="w-6 h-6 text-red-600" />;
      case 'MEDIUM': return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      case 'LOW': return <CheckCircle className="w-6 h-6 text-green-600" />;
      default: return <AlertTriangle className="w-6 h-6 text-gray-600" />;
    }
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to ScamGuard</h2>
        <p className="text-gray-600 text-lg">Your AI-powered protection against scams and fraud</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">How It Works</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Analyze emails for phishing attempts</li>
            <li>• Check suspicious text messages</li>
            <li>• Verify unknown phone calls</li>
            <li>• Scan websites for red flags</li>
          </ul>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Safety Tips</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Never share personal information</li>
            <li>• Be wary of urgent requests</li>
            <li>• Verify through official channels</li>
            <li>• Trust your instincts</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Email Analyzer Component
  const EmailAnalyzer = () => {
    const [formData, setFormData] = useState<EmailData>({
      sender: '',
      subject: '',
      content: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleEmailAnalysis(formData);
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <Mail className="w-12 h-12 text-blue-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Email Scam Analyzer</h2>
          <p className="text-gray-600">Check if an email is legitimate or a scam</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sender Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="sender@example.com"
              value={formData.sender}
              onChange={(e) => setFormData({...formData, sender: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
            <input
              type="text"
              className="input-field"
              placeholder="Email subject"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
            <textarea
              className="input-field"
              rows={6}
              placeholder="Paste the email content here..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze Email'}
          </button>
        </form>
      </div>
    );
  };

  // Text Analyzer Component
  const TextAnalyzer = () => {
    const [formData, setFormData] = useState<TextData>({
      content: '',
      sender_number: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleTextAnalysis(formData);
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Text Message Analyzer</h2>
          <p className="text-gray-600">Check if a text message is legitimate or suspicious</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sender Number (Optional)</label>
            <input
              type="tel"
              className="input-field"
              placeholder="+1 (555) 123-4567"
              value={formData.sender_number}
              onChange={(e) => setFormData({...formData, sender_number: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
            <textarea
              className="input-field"
              rows={6}
              placeholder="Paste the text message here..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </form>
      </div>
    );
  };

  // Call Analyzer Component
  const CallAnalyzer = () => {
    const [formData, setFormData] = useState<CallData>({
      caller_number: '',
      call_type: 'unknown',
      urgency_level: 'normal'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleCallAnalysis(formData);
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <Phone className="w-12 h-12 text-blue-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Phone Call Analyzer</h2>
          <p className="text-gray-600">Check if a phone call is legitimate or suspicious</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Caller Number</label>
            <input
              type="tel"
              className="input-field"
              placeholder="+1 (555) 123-4567"
              value={formData.caller_number}
              onChange={(e) => setFormData({...formData, caller_number: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Call Type</label>
            <select
              className="input-field"
              value={formData.call_type}
              onChange={(e) => setFormData({...formData, call_type: e.target.value})}
            >
              <option value="unknown">Unknown Number</option>
              <option value="private">Private/Blocked</option>
              <option value="international">International</option>
              <option value="local">Local Number</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
            <select
              className="input-field"
              value={formData.urgency_level}
              onChange={(e) => setFormData({...formData, urgency_level: e.target.value})}
            >
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze Call'}
          </button>
        </form>
      </div>
    );
  };

  // Website Analyzer Component
  const WebsiteAnalyzer = () => {
    const [formData, setFormData] = useState<WebsiteData>({
      url: '',
      content: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleWebsiteAnalysis(formData);
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <Globe className="w-12 h-12 text-blue-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Website Analyzer</h2>
          <p className="text-gray-600">Check if a website is legitimate or suspicious</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website Content (Optional)</label>
            <textarea
              className="input-field"
              rows={6}
              placeholder="Paste any suspicious content from the website..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>
          
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze Website'}
          </button>
        </form>
      </div>
    );
  };

  // Educational Content Component
  const EducationalContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Scam Prevention Guide</h2>
        <p className="text-gray-600">Learn how to protect yourself from scams</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Common Scam Types</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border-l-4 border-red-400">
              <h4 className="font-semibold text-red-800">Phishing Emails</h4>
              <p className="text-red-700 text-sm">Fake emails pretending to be from legitimate companies</p>
            </div>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800">SMS Scams</h4>
              <p className="text-yellow-700 text-sm">Text messages with urgent requests or fake links</p>
            </div>
            <div className="p-3 bg-orange-50 border-l-4 border-orange-400">
              <h4 className="font-semibold text-orange-800">Phone Scams</h4>
              <p className="text-orange-700 text-sm">Calls from fake government agencies or tech support</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Red Flags to Watch For</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Urgent or threatening language</li>
            <li>• Requests for personal information</li>
            <li>• Poor grammar or spelling</li>
            <li>• Suspicious links or attachments</li>
            <li>• Unrealistic promises or offers</li>
            <li>• Pressure to act immediately</li>
          </ul>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">What to Do If You're Scammed</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">1. Don't Panic</h4>
            <p className="text-blue-700">Stay calm and don't send more money or information</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">2. Document Everything</h4>
            <p className="text-green-700">Save emails, texts, and any other evidence</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">3. Report It</h4>
            <p className="text-purple-700">Contact authorities and report the scam</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">ScamGuard</h1>
            </div>
            <p className="text-sm text-gray-500">AI-Powered Scam Detection</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Shield },
              { id: 'email', label: 'Email', icon: Mail },
              { id: 'text', label: 'Text', icon: MessageSquare },
              { id: 'call', label: 'Call', icon: Phone },
              { id: 'website', label: 'Website', icon: Globe },
              { id: 'education', label: 'Learn', icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'email' && <EmailAnalyzer />}
          {activeTab === 'text' && <TextAnalyzer />}
          {activeTab === 'call' && <CallAnalyzer />}
          {activeTab === 'website' && <WebsiteAnalyzer />}
          {activeTab === 'education' && <EducationalContent />}
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  {getRiskIcon(analysisResult.risk_level)}
                  <div>
                    <h4 className={`text-lg font-semibold ${getRiskColor(analysisResult.risk_level)}`}>
                      Risk Level: {analysisResult.risk_level}
                    </h4>
                    <p className="text-gray-600">Score: {analysisResult.risk_score}/100</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h5 className="font-medium text-gray-700 mb-2">Source Credibility</h5>
                  <p className="text-gray-600">{analysisResult.source_credibility}</p>
                </div>
                
                {analysisResult.warnings.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Warnings</h5>
                    <ul className="space-y-1">
                      {analysisResult.warnings.map((warning, index) => (
                        <li key={index} className="text-red-600 text-sm">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Recommendations</h5>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-600 text-sm">• {rec}</li>
                  ))}
                </ul>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">
                    Analysis completed at: {new Date(analysisResult.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">Error: {error}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
