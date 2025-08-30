import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import About from './pages/About';
import CallTester from './components/CallTester';
import AIExampleGenerator from './components/AIExampleGenerator';
import { getUser } from './utils/auth';
import { LanguageProvider } from './contexts/LanguageContext';
import './utils/auth'; // Initialize axios interceptors
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <LanguageProvider>
      <Router>
        <div className="App">
          <Navbar user={user} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/call-test" element={<CallTester />} />
            <Route path="/ai-examples" element={<AIExampleGenerator />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;