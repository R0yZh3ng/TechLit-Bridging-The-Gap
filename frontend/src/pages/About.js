import React from 'react';

function About() {
  return (
    <div className="container">
      <h1 className="page-title"><i className="fas fa-info-circle"></i> About ScamSense</h1>

      <div className="about-card">
        <h2 className="section-title"><i className="fas fa-bullseye"></i> Our Mission</h2>
        <div className="content">
          <p>ScamSense is dedicated to bridging the digital divide by empowering users with the knowledge and tools to identify fraudulent content. In an age where misinformation and scams are increasingly sophisticated, we believe everyone deserves access to fraud detection education.</p>
          <p>Our platform combines cutting-edge AI technology with educational content to help users develop critical thinking skills for the digital age.</p>
        </div>
      </div>

      <div className="about-card">
        <h2 className="section-title"><i className="fas fa-cogs"></i> How It Works</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon"><i className="fas fa-robot"></i></div>
            <h3>AI Analysis</h3>
            <p>Powered by AWS Bedrock and Amazon Titan for intelligent fraud detection</p>
          </div>
          <div className="feature">
            <div className="feature-icon"><i className="fas fa-graduation-cap"></i></div>
            <h3>Educational Content</h3>
            <p>Learn about common fraud patterns and protection strategies</p>
          </div>
          <div className="feature">
            <div className="feature-icon"><i className="fas fa-gamepad"></i></div>
            <h3>Interactive Practice</h3>
            <p>Test your skills with real-world examples and quizzes</p>
          </div>
          <div className="feature">
            <div className="feature-icon"><i className="fas fa-mobile-alt"></i></div>
            <h3>Accessible Design</h3>
            <p>User-friendly interface designed for all skill levels</p>
          </div>
        </div>
      </div>

      <div className="about-card">
        <h2 className="section-title"><i className="fas fa-code"></i> Technology Stack</h2>
        <div className="content">
          <p>Built with modern, reliable technologies to ensure the best user experience:</p>
          <div className="tech-stack">
            <div className="tech-item"><i className="fab fa-python"></i> Python Flask</div>
            <div className="tech-item"><i className="fab fa-aws"></i> AWS Bedrock</div>
            <div className="tech-item"><i className="fas fa-brain"></i> Amazon Titan</div>
            <div className="tech-item"><i className="fas fa-link"></i> LangChain</div>
            <div className="tech-item"><i className="fab fa-html5"></i> HTML5</div>
            <div className="tech-item"><i className="fab fa-css3-alt"></i> CSS3</div>
            <div className="tech-item"><i className="fab fa-js"></i> JavaScript</div>
          </div>
        </div>
      </div>

      <div className="about-card">
        <h2 className="section-title"><i className="fas fa-chart-line"></i> Impact Statistics</h2>
        <div className="stats">
          <div className="stat">
            <div className="stat-number">95%</div>
            <div className="stat-label">Fraud Detection Accuracy</div>
          </div>
          <div className="stat">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Users Educated</div>
          </div>
          <div className="stat">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Available Support</div>
          </div>
          <div className="stat">
            <div className="stat-number">Free</div>
            <div className="stat-label">Always Accessible</div>
          </div>
        </div>
      </div>

      <div className="about-card">
        <h2 className="section-title"><i className="fas fa-shield-alt"></i> Why Fraud Detection Matters</h2>
        <div className="content">
          <p><strong>Digital literacy is essential in today's world.</strong> With the rise of sophisticated phishing attacks, fake news, and online scams, the ability to critically evaluate digital content has become a crucial life skill.</p>
          <p>Our platform helps users:</p>
          <ul style={{marginLeft: '2rem', marginTop: '1rem'}}>
            <li>Recognize common fraud patterns and tactics</li>
            <li>Develop critical thinking skills for digital content</li>
            <li>Protect personal and financial information</li>
            <li>Make informed decisions about online content</li>
            <li>Share knowledge with family and friends</li>
          </ul>
        </div>
      </div>

      <div className="about-card">
        <h2 className="section-title"><i className="fas fa-heart"></i> Get Involved</h2>
        <div className="content">
          <p>Help us bridge the digital divide! Share ScamSense with friends and family who could benefit from fraud detection education. Together, we can create a safer digital environment for everyone.</p>
          <p><strong>Remember:</strong> When in doubt, always verify information through official channels and trusted sources.</p>
        </div>
      </div>
    </div>
  );
}

export default About;