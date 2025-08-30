import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import ImageAnalyzer from '../components/ImageAnalyzer';

function Home() {
  const { language, t } = useLanguage();
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [examples, setExamples] = useState([]);

  useEffect(() => {
    loadExamples();
  }, [language]);

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
      const response = await axios.get(`/api/examples?lang=${language}`);
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
        <div className="hero-content">
          <h1 className="fade-in">
            <i className="fas fa-shield-alt"></i> {t('fraud_detection_trainer')}
          </h1>
          <p className="slide-up">{t('learn_to_identify')}</p>
        </div>
      </div>

      <div className="container">
        <div className="analyzer-card slide-up">
          <div className="component-header">
            <h2>
              <i className="fas fa-microscope"></i> {t('text_analyzer')}
            </h2>
            <p>{t('paste_suspicious')}</p>
          </div>
          
          <div className="form-group">
            <textarea
              className="form-control"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('placeholder')}
              rows="6"
            />
          </div>
          
          <div className="text-center">
            <button className="btn primary-btn" onClick={analyzeText} disabled={!text || loading}>
              <i className="fas fa-search"></i> {t('analyze_button')}
            </button>
          </div>
          
          {loading && (
            <div className="loading fade-in">
              {t('analyzing')}
            </div>
          )}
          
          {result && (
            <div className="result bounce-in">
              <div className="result-header">
                <h3><i className="fas fa-chart-line"></i> Analysis Result</h3>
              </div>
              <div className="result-content">
                <pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>{result}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="fade-in">
          <ImageAnalyzer />
        </div>

        <div className="text-center mb-5">
          <h2 className="section-title">
            <i className="fas fa-lightbulb"></i> {t('practice_examples')}
          </h2>
        </div>
        
        <div className="examples-grid">
          {examples.map((example, index) => (
            <div
              key={index}
              className={`example ${example.is_fraud ? 'fraud' : 'safe'} slide-up`}
              onClick={() => handleExampleClick(example.text)}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="status-indicator" style={{background: '#e2e8f0', color: '#4a5568'}}>
                  {example.type.replace('_', ' ').toUpperCase()}
                </div>
                <div className={`status-indicator ${example.is_fraud ? 'status-fraud' : 'status-safe'}`}>
                  <i className={`fas ${example.is_fraud ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
                  {example.is_fraud ? 'FRAUD' : 'SAFE'}
                </div>
              </div>
              
              <div className="detailed-analysis mb-4">
                <p>{example.text}</p>
              </div>
              
              <div className="text-center">
                <small style={{color: '#718096', fontWeight: '500'}}>
                  <i className="fas fa-mouse-pointer"></i> Click to analyze this example
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;