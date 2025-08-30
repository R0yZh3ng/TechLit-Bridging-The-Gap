import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

function ImageAnalyzer() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      const response = await fetch('http://localhost:8000/api/analyze/image', {
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

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
  };

  return (
    <div className="component-container slide-up">
      <div className="component-header">
        <h2>
          <i className="fas fa-image"></i> Image Fraud Analyzer
        </h2>
        <p>Upload suspicious images, documents, or screenshots for AI-powered analysis</p>
      </div>

      <div className="upload-section">
        <div 
          className={`file-input ${dragOver ? 'drag-over' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('image-upload').click()}
        >
          <div className="upload-content">
            <i className="fas fa-cloud-upload-alt" style={{fontSize: '3rem', color: '#667eea', marginBottom: '1rem'}}></i>
            <h3>Drop image here or click to browse</h3>
            <p>Supports JPG, PNG, GIF, WebP formats</p>
            <p style={{fontSize: '0.9rem', color: '#718096'}}>Maximum file size: 10MB</p>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{display: 'none'}}
          />
        </div>
        
        {selectedImage && (
          <div className="image-preview fade-in">
            <div className="preview-header">
              <h4><i className="fas fa-eye"></i> Image Preview</h4>
              <button onClick={clearImage} className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>
                <i className="fas fa-times"></i> Clear
              </button>
            </div>
            <img 
              src={selectedImage} 
              alt="Selected" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px', 
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }} 
            />
            <div className="text-center mt-4">
              <button 
                onClick={analyzeImage} 
                disabled={analyzing}
                className="btn primary-btn"
              >
                {analyzing ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Analyzing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search"></i> Analyze Image
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="analysis-result bounce-in">
          {result.error ? (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-triangle"></i> {result.error}
            </div>
          ) : (
            <div>
              <div className="result-header">
                <h3><i className="fas fa-chart-line"></i> Analysis Results</h3>
                <div className={`status-indicator ${
                  result.risk_level === 'HIGH' ? 'status-high' : 
                  result.risk_level === 'MEDIUM' ? 'status-medium' : 'status-low'
                }`}>
                  <i className={`fas ${
                    result.risk_level === 'HIGH' ? 'fa-exclamation-triangle' :
                    result.risk_level === 'MEDIUM' ? 'fa-exclamation-circle' : 'fa-check-circle'
                  }`}></i>
                  {result.risk_level} RISK
                </div>
              </div>
              
              <div className="risk-score mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span><strong>Risk Score:</strong></span>
                  <span className="text-lg font-bold">{result.risk_score}/100</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{
                      width: `${result.risk_score}%`,
                      background: getRiskColor(result.risk_level)
                    }}
                  ></div>
                </div>
              </div>
              
              {result.detailed_analysis && (
                <div className="detailed-analysis">
                  <h4><i className="fas fa-microscope"></i> Detailed Analysis:</h4>
                  <p>{result.detailed_analysis}</p>
                </div>
              )}
              
              {result.fraud_indicators && result.fraud_indicators.length > 0 && (
                <div className="fraud-indicators">
                  <h4><i className="fas fa-exclamation-triangle"></i> Fraud Indicators:</h4>
                  <ul>
                    {result.fraud_indicators.map((indicator, index) => (
                      <li key={index}>{indicator}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.warnings && result.warnings.length > 0 && (
                <div className="warnings">
                  <h4><i className="fas fa-shield-alt"></i> Security Warnings:</h4>
                  <ul>
                    {result.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="recommendations">
                  <h4><i className="fas fa-lightbulb"></i> Recommendations:</h4>
                  <ul>
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.analysis_method && (
                <div className="mt-4 text-center">
                  <small style={{color: '#718096'}}>
                    <i className="fas fa-cog"></i> Analysis Method: {result.analysis_method}
                    {result.detected_text_count && (
                      <> • Text Elements: {result.detected_text_count}</>
                    )}
                    {result.detected_labels_count && (
                      <> • Visual Elements: {result.detected_labels_count}</>
                    )}
                  </small>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .upload-content {
          text-align: center;
          padding: 2rem;
        }

        .upload-content h3 {
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .upload-content p {
          color: #718096;
          margin-bottom: 0.5rem;
        }

        .file-input {
          border: 3px dashed #cbd5e0;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(247, 250, 252, 0.8);
          backdrop-filter: blur(10px);
        }

        .file-input:hover, .file-input.drag-over {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
          transform: translateY(-2px);
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .preview-header h4 {
          color: #2d3748;
          font-weight: 700;
          margin: 0;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(226, 232, 240, 0.8);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.5s ease;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

export default ImageAnalyzer;