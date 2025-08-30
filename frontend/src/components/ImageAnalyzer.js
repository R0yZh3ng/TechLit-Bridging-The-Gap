import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function ImageAnalyzer() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ image: selectedImage })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      setResult({ error: 'Analysis failed. Please try again.' });
    }
    setAnalyzing(false);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return '#dc3545';
      case 'MEDIUM': return '#ffc107';
      case 'LOW': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="image-analyzer">
      <h2>🖼️ Image Fraud Analyzer</h2>
      <p>Upload suspicious images, documents, or screenshots for analysis</p>

      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
        />
        
        {selectedImage && (
          <div className="image-preview">
            <img src={selectedImage} alt="Selected" style={{ maxWidth: '300px', maxHeight: '200px' }} />
            <button 
              onClick={analyzeImage} 
              disabled={analyzing}
              className="analyze-btn"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </div>
        )}
      </div>

      {result && (
        <div className="analysis-result">
          {result.error ? (
            <div className="error">{result.error}</div>
          ) : (
            <div>
              <div className="risk-level" style={{ color: getRiskColor(result.risk_level) }}>
                Risk Level: {result.risk_level}
              </div>
              <div className="risk-score">Score: {result.risk_score}/100</div>
              
              {result.detailed_analysis && (
                <div className="detailed-analysis">
                  <h4>🔍 Analysis:</h4>
                  <p>{result.detailed_analysis}</p>
                </div>
              )}
              
              {result.fraud_indicators && result.fraud_indicators.length > 0 && (
                <div className="fraud-indicators">
                  <h4>⚠️ Fraud Indicators:</h4>
                  <ul>
                    {result.fraud_indicators.map((indicator, index) => (
                      <li key={index}>{indicator}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="recommendations">
                  <h4>💡 Recommendations:</h4>
                  <ul>
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageAnalyzer;