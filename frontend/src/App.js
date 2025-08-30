import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import About from './pages/About';
import DailyChallenge from './pages/DailyChallenge';
import { getUser } from './utils/auth';
import './utils/auth'; // Initialize axios interceptors
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for streak updates
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = getUser();
      setUser(updatedUser);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('streakUpdate', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('streakUpdate', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/daily-challenge" element={<DailyChallenge />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;