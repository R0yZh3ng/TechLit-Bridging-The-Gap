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
        <h1><i className="fas fa-search"></i> {t('fraud_detection_trainer')}</h1>
        <p>{t('learn_to_identify')}</p>
      </div>

      <div className="container">
        <div className="analyzer-card">
          <h2><i className="fas fa-microscope"></i> {t('text_analyzer')}</h2>
          <p>{t('paste_suspicious')}</p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('placeholder')}
          />
          <br /><br />
          <button className="btn" onClick={analyzeText}>
            <i className="fas fa-search"></i> {t('analyze_button')}
          </button>
          
          {loading && (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i> {t('analyzing')}
            </div>
          )}
          
          {result && (
            <div className="result">
              <pre>{result}</pre>
            </div>
          )}
        </div>

        <ImageAnalyzer />

        <h2 className="section-title">
          <i className="fas fa-lightbulb"></i> {t('practice_examples')}
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
                  ? t('click_to_analyze_fraud')
                  : t('click_to_analyze_safe')
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