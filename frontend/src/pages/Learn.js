import React from 'react';

function Learn() {
  return (
    <div className="container">
      <h1 className="page-title"><i className="fas fa-graduation-cap"></i> Learn About Fraud Detection</h1>

      <div className="lesson-card">
        <h2 className="lesson-title"><i className="fas fa-envelope"></i> Email Fraud (Phishing)</h2>
        <div className="lesson-content">
          <p>Phishing emails are designed to trick you into revealing personal information or clicking malicious links. They often impersonate trusted organizations like banks, social media sites, or government agencies.</p>
          
          <h3>Common Warning Signs:</h3>
          <div className="warning-signs">
            <div className="warning-item">
              <strong><i className="fas fa-exclamation-triangle"></i> Urgency Tactics</strong>
              <p>"Act now!" "Limited time!" "Account will be suspended!"</p>
            </div>
            <div className="warning-item">
              <strong><i className="fas fa-link"></i> Suspicious Links</strong>
              <p>Hover over links to see if they match the claimed destination</p>
            </div>
            <div className="warning-item">
              <strong><i className="fas fa-user-secret"></i> Generic Greetings</strong>
              <p>"Dear Customer" instead of your actual name</p>
            </div>
            <div className="warning-item">
              <strong><i className="fas fa-spell-check"></i> Poor Grammar</strong>
              <p>Spelling mistakes and awkward phrasing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lesson-card">
        <h2 className="lesson-title"><i className="fas fa-newspaper"></i> Fake News Detection</h2>
        <div className="lesson-content">
          <p>Fake news spreads misinformation through sensational headlines and unverified claims. Learning to spot these helps you make informed decisions.</p>
          
          <h3>Red Flags to Watch For:</h3>
          <div className="warning-signs">
            <div className="warning-item">
              <strong><i className="fas fa-exclamation"></i> Sensational Headlines</strong>
              <p>"You Won't Believe..." "Doctors Hate This..."</p>
            </div>
            <div className="warning-item">
              <strong><i className="fas fa-question-circle"></i> No Sources</strong>
              <p>Claims without credible references or citations</p>
            </div>
            <div className="warning-item">
              <strong><i className="fas fa-heart"></i> Emotional Manipulation</strong>
              <p>Designed to make you angry, scared, or excited</p>
            </div>
            <div className="warning-item">
              <strong><i className="fas fa-calendar"></i> Outdated Information</strong>
              <p>Old stories presented as current news</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lesson-card">
        <h2 className="lesson-title"><i className="fas fa-shield-alt"></i> Protection Tips</h2>
        <div className="lesson-content">
          <h3>How to Stay Safe:</h3>
          <div className="warning-signs">
            <div className="tip-item">
              <strong><i className="fas fa-pause"></i> Pause and Think</strong>
              <p>Take time to evaluate before acting on urgent requests</p>
            </div>
            <div className="tip-item">
              <strong><i className="fas fa-search"></i> Verify Sources</strong>
              <p>Check official websites and multiple news sources</p>
            </div>
            <div className="tip-item">
              <strong><i className="fas fa-phone"></i> Contact Directly</strong>
              <p>Call organizations using official phone numbers</p>
            </div>
            <div className="tip-item">
              <strong><i className="fas fa-users"></i> Ask Others</strong>
              <p>Consult trusted friends or family members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Learn;