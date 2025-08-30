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

  // Enhanced password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];
    let weaknesses = [];

    // Length check
    if (password.length >= 16) {
      score += 3;
      feedback.push("✓ Excellent length (16+ characters)");
    } else if (password.length >= 12) {
      score += 2;
      feedback.push("✓ Good length (12+ characters)");
    } else if (password.length >= 8) {
      score += 1;
      feedback.push("⚠ Minimum length (8+ characters)");
      weaknesses.push("Password is too short for optimal security");
    } else {
      feedback.push("✗ Too short (need 8+ characters)");
      weaknesses.push("Password is too short");
    }

    // Character variety checks
    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push("✓ Contains uppercase letters");
    } else {
      feedback.push("✗ Missing uppercase letters");
      weaknesses.push("Missing uppercase letters");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push("✓ Contains lowercase letters");
    } else {
      feedback.push("✗ Missing lowercase letters");
      weaknesses.push("Missing lowercase letters");
    }

    if (/[0-9]/.test(password)) {
      score += 1;
      feedback.push("✓ Contains numbers");
    } else {
      feedback.push("✗ Missing numbers");
      weaknesses.push("Missing numbers");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
      feedback.push("✓ Contains special characters");
    } else {
      feedback.push("✗ Missing special characters");
      weaknesses.push("Missing special characters");
    }

    // Pattern checks
    if (!/(.)\1{2,}/.test(password)) {
      score += 1;
      feedback.push("✓ No repeated characters");
    } else {
      feedback.push("✗ Avoid repeated characters");
      weaknesses.push("Contains repeated characters");
    }

    // Common weak patterns
    if (/123|abc|qwe|asd|password|admin|user|test/i.test(password)) {
      score -= 1;
      feedback.push("✗ Avoid common patterns");
      weaknesses.push("Contains common patterns");
    }

    // Sequential patterns
    if (/123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) {
      score -= 1;
      feedback.push("✗ Avoid sequential patterns");
      weaknesses.push("Contains sequential patterns");
    }

    // Personal info patterns (basic check)
    if (/password|pass|user|admin|test|demo|guest/i.test(password)) {
      score -= 1;
      feedback.push("✗ Avoid common words");
      weaknesses.push("Contains common words");
    }

    return { score, feedback, weaknesses };
  };

  const passwordStrength = checkPasswordStrength(password);
  const strengthLevel = passwordStrength.score >= 6 ? 'strong' : passwordStrength.score >= 4 ? 'medium' : 'weak';

  // Function to get detailed weakness explanation
  const getWeaknessExplanation = (weaknesses) => {
    if (weaknesses.length === 0) return null;
    
    const explanations = {
      "Password is too short": "Short passwords are easily cracked by brute force attacks. Use at least 12 characters for better security.",
      "Password is too short for optimal security": "While 8+ characters meet minimum requirements, 12+ characters provide much better protection.",
      "Missing uppercase letters": "Uppercase letters increase password complexity and make it harder to guess.",
      "Missing lowercase letters": "Lowercase letters are essential for password variety and security.",
      "Missing numbers": "Numbers add complexity and make your password more resistant to dictionary attacks.",
      "Missing special characters": "Special characters like @, #, $, % significantly increase password strength.",
      "Contains repeated characters": "Repeated characters reduce password entropy and make it easier to crack.",
      "Contains common patterns": "Common patterns like '123' or 'abc' are easily guessed by attackers.",
      "Contains sequential patterns": "Sequential patterns are predictable and should be avoided.",
      "Contains common words": "Common words like 'password' or 'admin' are easily guessed."
    };

    return weaknesses.map(weakness => explanations[weakness] || weakness).join(' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check password strength for registration
    if (isRegister) {
      if (strengthLevel === 'weak') {
        setError('Password is too weak. Please choose a stronger password.');
        setLoading(false);
        return;
      } else if (strengthLevel === 'medium') {
        setError('Password is moderately strong. For better security, please choose a strong password.');
        setLoading(false);
        return;
      }
    }

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
              <div className={`strength-indicator ${strengthLevel}`}>
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{width: `${Math.max(0, Math.min(100, (passwordStrength.score / 8) * 100))}%`}}
                  ></div>
                </div>
                <span className="strength-text">
                  {strengthLevel === 'strong' ? 'Strong' : 
                   strengthLevel === 'medium' ? 'Moderate' : 'Weak'}
                </span>
              </div>
              
              <ul className="strength-checklist">
                {passwordStrength.feedback.map((item, index) => (
                  <li key={index} className={item.startsWith('✓') ? 'pass' : item.startsWith('⚠') ? 'warning' : 'fail'}>
                    {item}
                  </li>
                ))}
              </ul>

              {passwordStrength.weaknesses.length > 0 && (
                <div className="weakness-explanation">
                  <h5><i className="fas fa-exclamation-triangle"></i> Why This Password is Weak:</h5>
                  <p>{getWeaknessExplanation(passwordStrength.weaknesses)}</p>
                </div>
              )}

              {strengthLevel === 'weak' && (
                <div className="registration-blocked">
                  <p><i className="fas fa-ban"></i> Registration blocked: Password is too weak</p>
                </div>
              )}

              {strengthLevel === 'medium' && (
                <div className="registration-warning">
                  <p><i className="fas fa-exclamation-circle"></i> Warning: Consider using a stronger password</p>
                </div>
              )}

              {strengthLevel === 'strong' && (
                <div className="registration-approved">
                  <p><i className="fas fa-check-circle"></i> Password strength approved for registration</p>
                </div>
              )}
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