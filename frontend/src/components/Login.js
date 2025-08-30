import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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
  );
}

export default Login;