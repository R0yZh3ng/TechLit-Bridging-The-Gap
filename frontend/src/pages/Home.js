import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [examples, setExamples] = useState([]);

  useEffect(() => {
    loadExamples();
  }, []);

  const analyzeText = async () => {
    if (!text) return;
    
    setLoading(true);
    setResult('');
    
    try {
      const response = await axios.post('/analyze', { text });
      setResult(response.data.analysis);
    } catch (error) {
      setResult('Error analyzing text. Please try again.');
    }
    
    setLoading(false);
  };

  const loadExamples = async () => {
    try {
      const response = await axios.get('/examples');
      setExamples(response.data);
    } catch (error) {
      console.error('Error loading examples:', error);
    }
  };

  const handleExampleClick = (exampleText) => {
    setText(exampleText);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="hero">
        <h1><i className="fas fa-search"></i> Fraud Detection Trainer</h1>
        <p>Learn to identify fraudulent emails and news articles with AI-powered analysis</p>
      </div>

      <div className="container">
        <div className="analyzer-card">
          <h2><i className="fas fa-microscope"></i> Text Analyzer</h2>
          <p>Paste suspicious text below for instant fraud analysis:</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste email or news text here..."
          />
          <br /><br />
          <button className="btn" onClick={analyzeText}>
            <i className="fas fa-search"></i> Analyze for Fraud
          </button>
          
          {loading && (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i> Analyzing...
            </div>
          )}
          
          {result && (
            <div className="result">
              <pre>{result}</pre>
            </div>
          )}
        </div>

        <h2 className="section-title">
          <i className="fas fa-lightbulb"></i> Practice Examples
        </h2>
        
        <div className="examples-grid">
          {examples.map((example, index) => (
            <div
              key={index}
              className={`example ${example.is_fraud ? 'fraud' : 'safe'}`}
              onClick={() => handleExampleClick(example.text)}
            >
              <h3>
                <i className={`fas ${example.is_fraud ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>{' '}
                {example.type.replace('_', ' ').toUpperCase()}
              </h3>
              <p>{example.text}</p>
              <small>
                {example.is_fraud 
                  ? 'Click to analyze this fraud example' 
                  : 'Click to analyze this legitimate example'
                }
              </small>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;