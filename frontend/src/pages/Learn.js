import React from 'react';

function Learn() {
  return (
    <>
      <div className="hero">
        <div className="hero-content">
          <h1 className="fade-in">
            <i className="fas fa-graduation-cap"></i> Learn About Fraud Detection
          </h1>
          <p className="slide-up">Master the art of identifying scams, phishing, and fraudulent content</p>
        </div>
      </div>
      
      <div className="container">
        <div className="lesson-card slide-up">
          <h2 className="lesson-title">
            <i className="fas fa-envelope"></i> Email Fraud (Phishing)
          </h2>
          <div className="lesson-content">
            <div className="alert alert-info mb-4">
              <p><strong>📧 What is Phishing?</strong> Phishing emails are designed to trick you into revealing personal information or clicking malicious links. They often impersonate trusted organizations like banks, social media sites, or government agencies.</p>
            </div>
            
            <h3><i className="fas fa-search"></i> Common Warning Signs:</h3>
            <div className="warning-signs">
              <div className="warning-item">
                <strong><i className="fas fa-exclamation-triangle"></i> Urgency Tactics</strong>
                <p>"Act now!" "Limited time!" "Account will be suspended!" - Scammers create false urgency to prevent you from thinking clearly.</p>
              </div>
              <div className="warning-item">
                <strong><i className="fas fa-link"></i> Suspicious Links</strong>
                <p>Hover over links to see if they match the claimed destination. Look for misspelled domains or suspicious URLs.</p>
              </div>
              <div className="warning-item">
                <strong><i className="fas fa-user-secret"></i> Generic Greetings</strong>
                <p>"Dear Customer" instead of your actual name. Legitimate companies usually personalize their communications.</p>
              </div>
              <div className="warning-item">
                <strong><i className="fas fa-spell-check"></i> Poor Grammar</strong>
                <p>Spelling mistakes, awkward phrasing, and poor formatting are common in phishing emails.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lesson-card slide-up" style={{animationDelay: '0.2s'}}>
          <h2 className="lesson-title">
            <i className="fas fa-newspaper"></i> Fake News Detection
          </h2>
          <div className="lesson-content">
            <div className="alert alert-warning mb-4">
              <p><strong>📰 What is Fake News?</strong> Fake news spreads misinformation through sensational headlines and unverified claims. Learning to spot these helps you make informed decisions and avoid being manipulated.</p>
            </div>
            
            <h3><i className="fas fa-flag"></i> Red Flags to Watch For:</h3>
            <div className="warning-signs">
              <div className="warning-item">
                <strong><i className="fas fa-exclamation"></i> Sensational Headlines</strong>
                <p>"You Won't Believe..." "Doctors Hate This..." - Clickbait headlines designed to grab attention rather than inform.</p>
              </div>
              <div className="warning-item">
                <strong><i className="fas fa-question-circle"></i> No Sources</strong>
                <p>Claims without credible references, citations, or expert quotes. Legitimate news always cites sources.</p>
              </div>
              <div className="warning-item">
                <strong><i className="fas fa-heart"></i> Emotional Manipulation</strong>
                <p>Content designed to make you angry, scared, or excited rather than inform you objectively.</p>
              </div>
              <div className="warning-item">
                <strong><i className="fas fa-calendar"></i> Outdated Information</strong>
                <p>Old stories presented as current news, or information taken out of its original context.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lesson-card slide-up" style={{animationDelay: '0.4s'}}>
          <h2 className="lesson-title">
            <i className="fas fa-shield-alt"></i> Protection Strategies
          </h2>
          <div className="lesson-content">
            <div className="alert alert-success mb-4">
              <p><strong>🛡️ Stay Protected:</strong> The best defense against fraud is knowledge and careful verification. Here are proven strategies to keep yourself safe.</p>
            </div>
            
            <h3><i className="fas fa-lock"></i> How to Stay Safe:</h3>
            <div className="warning-signs">
              <div className="tip-item">
                <strong><i className="fas fa-pause"></i> Pause and Think</strong>
                <p>Take time to evaluate before acting on urgent requests. Scammers rely on quick, emotional decisions.</p>
              </div>
              <div className="tip-item">
                <strong><i className="fas fa-search"></i> Verify Sources</strong>
                <p>Check official websites, multiple news sources, and cross-reference information before believing or sharing.</p>
              </div>
              <div className="tip-item">
                <strong><i className="fas fa-phone"></i> Contact Directly</strong>
                <p>Call organizations using official phone numbers from their website, not numbers provided in suspicious messages.</p>
              </div>
              <div className="tip-item">
                <strong><i className="fas fa-users"></i> Ask Others</strong>
                <p>Consult trusted friends, family members, or experts when you're unsure about something.</p>
              </div>
            </div>
            
            <div className="alert alert-info mt-4">
              <h4><i className="fas fa-lightbulb"></i> Pro Tips:</h4>
              <ul style={{marginTop: '1rem', paddingLeft: '1.5rem'}}>
                <li>Enable two-factor authentication on all important accounts</li>
                <li>Keep software and browsers updated with latest security patches</li>
                <li>Use strong, unique passwords for each account</li>
                <li>Be skeptical of unsolicited offers or requests for personal information</li>
                <li>Trust your instincts - if something feels wrong, it probably is</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Learn;