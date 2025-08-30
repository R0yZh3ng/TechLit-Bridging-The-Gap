import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordTips, setShowPasswordTips] = useState(false);
  const [showPasswordSuggestor, setShowPasswordSuggestor] = useState(false);
  const [dynamicPasswords, setDynamicPasswords] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  // Strong password suggestions with explanations
  const strongPasswords = [
    {
      password: "Dragon$2024!secure",
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

    // Function to generate dynamic password suggestions
  const generatePasswordSuggestions = () => {
    const themes = [
      { name: 'Nature', words: ['Mountain', 'Ocean', 'Forest', 'River', 'Desert'] },
      { name: 'Animals', words: ['Dragon', 'Phoenix', 'Eagle', 'Lion', 'Tiger'] },
      { name: 'Colors', words: ['Purple', 'Emerald', 'Sapphire', 'Crimson', 'Golden'] },
      { name: 'Elements', words: ['Fire', 'Water', 'Earth', 'Wind', 'Lightning'] },
      { name: 'Professions', words: ['Doctor', 'Engineer', 'Artist', 'Chef', 'Pilot'] }
    ];
    
    const symbols = ['@', '#', '$', '%', '&', '*', '!', '?', '^', '+'];
    const numbers = ['2024', '2025', '99', '42', '7', '13', '21', '100'];
    const lowercaseWords = ['secure', 'safe', 'strong', 'power', 'guard'];
    
    const suggestions = [];
    
    themes.forEach(theme => {
      const word = theme.words[Math.floor(Math.random() * theme.words.length)];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const number = numbers[Math.floor(Math.random() * numbers.length)];
      const lowercaseWord = lowercaseWords[Math.floor(Math.random() * lowercaseWords.length)];
      
      // Generate variations that definitely meet strong criteria (score >= 6)
      suggestions.push({
        password: `${word}${symbol}${number}!${lowercaseWord}`,
        explanation: `${theme.name} theme with uppercase, lowercase, numbers, and symbols`,
        strength: 'strong'
      });
      
      suggestions.push({
        password: `${word}@${number}#${lowercaseWord}`,
        explanation: `${theme.name} theme with mixed case and symbols`,
        strength: 'strong'
      });
      
      suggestions.push({
        password: `${lowercaseWord}${symbol}${word}${number}`,
        explanation: `${theme.name} theme with lowercase start and mixed characters`,
        strength: 'strong'
      });
    });
    
    // Filter to ensure all passwords are actually strong
    const strongSuggestions = suggestions.filter(suggestion => {
      const strength = checkPasswordStrength(suggestion.password);
      return strength.score >= 6;
    });
    
    // Shuffle and return top 5, or all if less than 5
    return strongSuggestions.sort(() => Math.random() - 0.5).slice(0, 5);
  };

  // Function to refresh dynamic passwords
  const refreshDynamicPasswords = () => {
    setDynamicPasswords(generatePasswordSuggestions());
  };

  // Function to initialize dynamic passwords when tips are first shown
  const initializeDynamicPasswords = () => {
    if (dynamicPasswords.length === 0) {
      setDynamicPasswords(generatePasswordSuggestions());
    }
  };

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
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (isRegister && e.target.value.length > 0) {
                      setShowPasswordSuggestor(true);
                    } else {
                      setShowPasswordSuggestor(false);
                    }
                  }}
                  onFocus={() => {
                    if (isRegister && password.length === 0) {
                      setShowPasswordSuggestor(true);
                    }
                  }}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {isRegister && password && (
                <div className={`password-strength ${strengthLevel}`}>
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

      {/* Show Tips Button - Appears when sidebar is hidden */}
      {isRegister && !showPasswordTips && (
        <div className="show-tips-button">
          <button 
            className="show-tips-btn"
            onClick={() => {
              initializeDynamicPasswords();
              setShowPasswordTips(true);
            }}
          >
            <i className="fas fa-shield-alt"></i> Show Password Security Tips
          </button>
        </div>
      )}

      {/* Password Suggestor - Shows when user starts typing in register mode */}
      {isRegister && showPasswordSuggestor && (
        <div className="password-suggestor">
          <div className="suggestor-header">
            <h4><i className="fas fa-lightbulb"></i> Need a Strong Password?</h4>
            <button 
              className="close-suggestor"
              onClick={() => setShowPasswordSuggestor(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="suggestor-content">
            <p>Here are some strong password suggestions:</p>
            <div className="suggestor-passwords">
              {generatePasswordSuggestions().map((suggestion, index) => (
                <div key={index} className="suggestor-password">
                  <div className="suggestion-display">
                    <code>{suggestion.password}</code>
                    <button 
                      className="use-password-btn"
                      onClick={() => {
                        setPassword(suggestion.password);
                        setShowPasswordSuggestor(false);
                      }}
                      title="Use this password"
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button 
                      className="copy-password-btn"
                      onClick={() => navigator.clipboard.writeText(suggestion.password)}
                      title="Copy to clipboard"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                  <p className="suggestion-desc">{suggestion.explanation}</p>
                </div>
              ))}
            </div>
            <div className="suggestor-tip">
              <p><i className="fas fa-info-circle"></i> <strong>Tip:</strong> Choose a password that's memorable to you but hard for others to guess!</p>
            </div>
          </div>
        </div>
      )}

      {/* Password Strength Sidebar - Only show when registering */}
      {isRegister && showPasswordTips && (
        <div className="password-sidebar">
          <div className="sidebar-header">
            <h3><i className="fas fa-shield-alt"></i> Password Security</h3>
            <button 
              className="toggle-btn"
              onClick={() => {
                setShowPasswordTips(false);
              }}
            >
              Hide Tips
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

          {/* Quick Password Suggestion */}
          <div className="quick-suggestion">
            <h4><i className="fas fa-lightbulb"></i> Need a Strong Password?</h4>
            <div className="quick-suggestion-content">
              <div className="suggestion-display">
                <code>{generatePasswordSuggestions()[0]?.password || 'Mountain@2024!secure'}</code>
                <button 
                  className="use-btn"
                  onClick={() => setPassword(generatePasswordSuggestions()[0]?.password || 'Mountain@2024!secure')}
                  title="Use this password"
                >
                  <i className="fas fa-check"></i>
                </button>
                <button 
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(generatePasswordSuggestions()[0]?.password || 'Mountain@2024!secure')}
                  title="Copy to clipboard"
                >
                  <i className="fas fa-copy"></i>
                </button>
              </div>
              <p className="suggestion-explanation">Strong password with mixed case, numbers, and symbols</p>
            </div>
          </div>

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

              <h4>
                <i className="fas fa-magic"></i> Dynamic Password Generator
                <button 
                  className="refresh-btn"
                  onClick={refreshDynamicPasswords}
                  title="Generate new passwords"
                >
                  <i className="fas fa-sync-alt"></i>
                </button>
              </h4>
              <div className="password-suggestions">
                {dynamicPasswords.map((suggestion, index) => {
                  const strength = checkPasswordStrength(suggestion.password);
                  const isStrong = strength.score >= 6;
                  return (
                    <div key={index} className={`password-suggestion ${isStrong ? 'strong-password' : 'weak-password'}`}>
                      <div className="suggestion-password">
                        <code>{suggestion.password}</code>
                        <span className={`strength-badge ${isStrong ? 'strong' : 'weak'}`}>
                          {isStrong ? 'Strong' : 'Weak'} ({strength.score}/8)
                        </span>
                        <button 
                          className="use-btn"
                          onClick={() => setPassword(suggestion.password)}
                          title="Use this password"
                        >
                          <i className="fas fa-check"></i>
                        </button>
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
                  );
                })}
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