import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordTips, setShowPasswordTips] = useState(false);

  // Strong password suggestions with explanations
  const strongPasswords = [
    {
      password: "Dragon$2024!Secure",
      explanation: "Uses uppercase, lowercase, numbers, symbols, and is 18+ characters long"
    },
    {
      password: "Purple@Elephant#99",
      explanation: "Memorable phrase with mixed case, symbols, and numbers"
    },
    {
      password: "Winter*Snowflake&42",
      explanation: "Seasonal theme with special characters and numbers"
    },
    {
      password: "Coffee$Lover!2024",
      explanation: "Personal interest with symbols and current year"
    },
    {
      password: "Mountain@Climber#7",
      explanation: "Action-based phrase with symbols and single digit"
    }
  ];

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 12) {
      score += 2;
      feedback.push("✓ Good length (12+ characters)");
    } else if (password.length >= 8) {
      score += 1;
      feedback.push("⚠ Minimum length (8+ characters)");
    } else {
      feedback.push("✗ Too short (need 8+ characters)");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push("✓ Contains uppercase letters");
    } else {
      feedback.push("✗ Missing uppercase letters");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push("✓ Contains lowercase letters");
    } else {
      feedback.push("✗ Missing lowercase letters");
    }

    if (/[0-9]/.test(password)) {
      score += 1;
      feedback.push("✓ Contains numbers");
    } else {
      feedback.push("✗ Missing numbers");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
      feedback.push("✓ Contains special characters");
    } else {
      feedback.push("✗ Missing special characters");
    }

    if (!/(.)\1{2,}/.test(password)) {
      score += 1;
      feedback.push("✓ No repeated characters");
    } else {
      feedback.push("✗ Avoid repeated characters");
    }

    return { score, feedback };
  };

  const passwordStrength = checkPasswordStrength(password);
  const strengthLevel = passwordStrength.score >= 5 ? 'strong' : passwordStrength.score >= 3 ? 'medium' : 'weak';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/register' : '/login';
      console.log('Making request to:', endpoint, { email, password });
      
      const response = await axios.post(endpoint, { email, password });
      console.log('Response:', response.data);
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (error) {
      console.error('Auth error:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.error || 'Authentication failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-main">
        <div className="login-card">
          <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-input-container">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {isRegister && password && (
                <div className={`password-strength ${strengthLevel}`}>
                  <div className="strength-bar">
                    <div 
                      className="strength-fill" 
                      style={{width: `${(passwordStrength.score / 6) * 100}%`}}
                    ></div>
                  </div>
                  <span className="strength-text">
                    {strengthLevel === 'strong' ? 'Strong' : 
                     strengthLevel === 'medium' ? 'Medium' : 'Weak'}
                  </span>
                </div>
              )}
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Loading...' : (isRegister ? 'Register' : 'Login')}
            </button>
          </form>
          
          {error && <div className="error">{error}</div>}
          
          <p>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button" 
              className="link-btn"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
      </div>

      {/* Password Strength Sidebar - Only show when registering */}
      {isRegister && (
        <div className="password-sidebar">
          <div className="sidebar-header">
            <h3><i className="fas fa-shield-alt"></i> Password Security</h3>
            <button 
              className="toggle-btn"
              onClick={() => setShowPasswordTips(!showPasswordTips)}
            >
              {showPasswordTips ? 'Hide' : 'Show'} Tips
            </button>
          </div>

          {password && (
            <div className="password-feedback">
              <h4>Your Password Strength:</h4>
              <ul className="strength-checklist">
                {passwordStrength.feedback.map((item, index) => (
                  <li key={index} className={item.startsWith('✓') ? 'pass' : item.startsWith('⚠') ? 'warning' : 'fail'}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showPasswordTips && (
            <div className="password-tips">
              <h4><i className="fas fa-lightbulb"></i> Strong Password Examples</h4>
              <div className="password-suggestions">
                {strongPasswords.map((suggestion, index) => (
                  <div key={index} className="password-suggestion">
                    <div className="suggestion-password">
                      <code>{suggestion.password}</code>
                      <button 
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText(suggestion.password)}
                        title="Copy to clipboard"
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                    <p className="suggestion-explanation">{suggestion.explanation}</p>
                  </div>
                ))}
              </div>

              <div className="security-tips">
                <h4><i className="fas fa-info-circle"></i> Why These Are Strong:</h4>
                <ul>
                  <li><strong>Length:</strong> 12+ characters make brute force attacks much harder</li>
                  <li><strong>Complexity:</strong> Mix of uppercase, lowercase, numbers, and symbols</li>
                  <li><strong>Memorability:</strong> Based on phrases or concepts you can remember</li>
                  <li><strong>Uniqueness:</strong> Not based on personal information or common patterns</li>
                  <li><strong>Variety:</strong> Different character types increase entropy</li>
                </ul>
              </div>

              <div className="security-warnings">
                <h4><i className="fas fa-exclamation-triangle"></i> Avoid These:</h4>
                <ul>
                  <li>Personal info (birthdays, names, addresses)</li>
                  <li>Common words or phrases</li>
                  <li>Sequential patterns (123456, abcdef)</li>
                  <li>Repeated characters (aaa, 111)</li>
                  <li>Keyboard patterns (qwerty, asdf)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;