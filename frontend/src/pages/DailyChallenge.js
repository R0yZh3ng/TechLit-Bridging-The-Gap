import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DailyChallenge() {
  const [challenge, setChallenge] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userStreak, setUserStreak] = useState(0);

  useEffect(() => {
    loadDailyChallenge();
    loadUserStreak();
  }, []);

  const loadUserStreak = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserStreak(user.current_streak || 0);
  };

  const loadDailyChallenge = async () => {
    try {
      const response = await axios.get('http://localhost:8000/daily-challenge');
      setChallenge(response.data);
    } catch (error) {
      console.error('Error loading daily challenge:', error);
      setChallenge(null);
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null) return;
    
    setSubmitting(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.post('http://localhost:8000/submit-challenge', {
        answer: selectedAnswer,
        user_email: user.email
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Backend response:', response.data);
      setResult(response.data);
      if (response.data.correct) {
        setUserStreak(response.data.current_streak);
        // Update user in localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.current_streak = response.data.current_streak;
        localStorage.setItem('user', JSON.stringify(user));
        // Trigger custom event to update navbar
        window.dispatchEvent(new Event('streakUpdate'));
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setResult({ error: 'Failed to submit answer' });
    }
    
    setSubmitting(false);
  };

  const resetChallenge = () => {
    setSelectedAnswer(null);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Loading daily challenge...
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container">
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i> Failed to load daily challenge. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">
        <i className="fas fa-calendar-day"></i> Daily Challenge
      </h1>

      <div className="challenge-card">
        <div className="challenge-header">
          <h2><i className="fas fa-trophy"></i> Today's Challenge</h2>
          <div className="streak-display">
            <i className="fas fa-fire"></i> Streak: {result && result.correct ? result.current_streak : userStreak}
          </div>
        </div>

        {challenge && (
          <>
            <div className="challenge-text">
              <p><strong>Analyze this message:</strong></p>
              <div className="text-sample">{challenge.text}</div>
            </div>

            <div className="challenge-options">
              <h3>What type of message is this?</h3>
              {challenge.options.map((option, index) => (
                <div
                  key={index}
                  className={`option ${
                    selectedAnswer === index ? 'selected' : ''
                  } ${
                    result && selectedAnswer === index && index !== challenge.correct ? 'incorrect' : ''
                  }`}
                  onClick={() => !result && setSelectedAnswer(index)}
                  style={{
                    pointerEvents: result ? 'none' : 'auto',
                    cursor: result ? 'default' : 'pointer'
                  }}
                >
                  {option}
                </div>
              ))}
            </div>

            {!result && (
              <button 
                className="btn" 
                onClick={submitAnswer}
                disabled={selectedAnswer === null || submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            )}

            {result && (
              <div className={`result ${result.correct ? 'correct' : 'incorrect'}`}>
                <h3>
                  <i className={`fas ${result.correct ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                  {result.message}
                </h3>
                
                {result.correct && (
                  <>
                    <div className="explanation-box">
                      <p><strong>Explanation:</strong> {challenge.explanation}</p>
                    </div>
                    <p><i className="fas fa-check-circle"></i> Great job! Come back tomorrow for a new challenge!</p>
                  </>
                )}
                
                {!result.correct && (
                  <button className="btn" onClick={resetChallenge}>
                    Try Again
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="challenge-info">
        <h3><i className="fas fa-info-circle"></i> How Daily Challenges Work</h3>
        <ul>
          <li>New challenge every day</li>
          <li>Unlimited attempts until you get it right</li>
          <li>Build your streak by completing daily challenges</li>
          <li>Learn from detailed explanations</li>
        </ul>
      </div>
    </div>
  );
}

export default DailyChallenge;