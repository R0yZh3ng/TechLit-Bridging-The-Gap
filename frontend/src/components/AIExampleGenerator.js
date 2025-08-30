import React, { useState } from 'react';

const AIExampleGenerator = () => {
    const [examples, setExamples] = useState([]);
    const [loading, setLoading] = useState(false);
    const [exampleType, setExampleType] = useState('mixed');
    const [count, setCount] = useState(5);

    const generateExamples = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/generate/examples', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    type: exampleType, 
                    count: count 
                })
            });

            if (!response.ok) throw new Error('Failed to generate examples');
            
            const data = await response.json();
            setExamples(data);
        } catch (error) {
            console.error('Error generating examples:', error);
            alert('Failed to generate examples. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const analyzeExample = async (text) => {
        try {
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error('Analysis failed');
            
            const result = await response.json();
            return result.result;
        } catch (error) {
            console.error('Analysis error:', error);
            return 'Analysis failed';
        }
    };

    const handleAnalyze = async (index) => {
        const updatedExamples = [...examples];
        updatedExamples[index].analyzing = true;
        setExamples(updatedExamples);

        const analysis = await analyzeExample(examples[index].text);
        
        updatedExamples[index].analysis = analysis;
        updatedExamples[index].analyzing = false;
        setExamples(updatedExamples);
    };

    return (
        <div className="container">
            <div className="component-container slide-up">
                <div className="component-header">
                    <h2>🤖 AI Example Generator</h2>
                    <p>Generate random fraud detection examples using AI</p>
                </div>

                <div className="card">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Example Type:</label>
                            <select 
                                className="form-control"
                                value={exampleType} 
                                onChange={(e) => setExampleType(e.target.value)}
                                disabled={loading}
                            >
                                <option value="mixed">🌍 Mixed Types</option>
                                <option value="phishing_email">🎣 Phishing Emails</option>
                                <option value="scam_text">📱 Scam Texts</option>
                                <option value="fake_news">📰 Fake News</option>
                                <option value="investment_scam">💰 Investment Scams</option>
                                <option value="tech_support_scam">💻 Tech Support Scams</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Count:</label>
                            <select 
                                className="form-control"
                                value={count} 
                                onChange={(e) => setCount(parseInt(e.target.value))}
                                disabled={loading}
                            >
                                <option value={3}>3 Examples</option>
                                <option value={5}>5 Examples</option>
                                <option value={8}>8 Examples</option>
                                <option value={10}>10 Examples</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-center">
                        <button 
                            onClick={generateExamples} 
                            disabled={loading}
                            className="btn primary-btn"
                        >
                            {loading ? '⏳ Generating...' : '🎲 Generate Examples'}
                        </button>
                    </div>
                </div>

                {examples.length > 0 && (
                    <div className="mt-5">
                        <h3 className="section-title" style={{color: '#2d3748', marginBottom: '2rem'}}>
                            📊 Generated Examples
                        </h3>
                        <div className="examples-grid">
                            {examples.map((example, index) => (
                                <div key={index} className={`grid-item fade-in ${example.is_fraud ? 'fraud' : 'safe'}`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="status-indicator" style={{background: '#e2e8f0', color: '#4a5568'}}>
                                            {example.type.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span className={`status-indicator ${example.is_fraud ? 'status-fraud' : 'status-safe'}`}>
                                            {example.is_fraud ? '⚠️ FRAUD' : '✅ SAFE'}
                                        </span>
                                    </div>
                                    
                                    <div className="detailed-analysis mb-4">
                                        <p>"{example.text}"</p>
                                    </div>
                                    
                                    {example.explanation && (
                                        <div className="alert alert-info mb-4">
                                            <strong>🧠 Why:</strong> {example.explanation}
                                        </div>
                                    )}

                                    <div className="text-center mb-4">
                                        <button 
                                            onClick={() => handleAnalyze(index)}
                                            disabled={example.analyzing}
                                            className="btn btn-secondary"
                                        >
                                            {example.analyzing ? '⏳ Analyzing...' : '🔍 Analyze with AI'}
                                        </button>
                                    </div>

                                    {example.analysis && (
                                        <div className="alert alert-warning">
                                            <h4 className="mb-2">🤖 AI Analysis:</h4>
                                            <div className="result-content" style={{fontFamily: 'monospace', fontSize: '0.9rem'}}>
                                                {example.analysis}
                                            </div>
                                        </div>
                                    )}

                                    {example.generated_by && (
                                        <div className="text-right mt-3" style={{fontSize: '0.8rem', color: '#718096'}}>
                                            🎨 Generated by: {example.generated_by}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default AIExampleGenerator;