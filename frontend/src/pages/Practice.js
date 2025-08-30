import React, { useState } from 'react';

function Practice() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  const quizData = [
    {
      question: "Is this email legitimate or fraudulent?",
      text: "URGENT: Your PayPal account has been limited! Click here immediately to verify your information or your account will be permanently suspended within 24 hours!",
      options: ["Legitimate", "Fraudulent"],
      correct: 1,
      explanation: "This is fraudulent. Red flags: urgency tactics, threats of account suspension, and pressure to click immediately."
    },
    {
      question: "What type of message is this?",
      text: "Your monthly bank statement is now available. Please log into your account through our official website to view it.",
      options: ["Legitimate", "Fraudulent"],
      correct: 0,
      explanation: "This appears legitimate. It doesn't use urgency tactics or ask for immediate action through links."
    },
    {
      question: "Is this news headline trustworthy?",
      text: "SHOCKING: Scientists discover miracle weight loss pill that doctors don't want you to know about! Click to see the secret they're hiding!",
      options: ["Trustworthy", "Fake News"],
      correct: 1,
      explanation: "This is fake news. Red flags: sensational language, conspiracy claims, and clickbait tactics."
    },
    {
      question: "How should you respond to this message?",
      text: "Congratulations! You've won $1,000,000 in our lottery! Send us your bank details to claim your prize immediately!",
      options: ["Send bank details", "Ignore and delete", "Call the number provided"],
      correct: 1,
      explanation: "Always ignore and delete such messages. Legitimate lotteries don't ask for bank details upfront."
    }
  ];

  const selectOption = (index) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const submitAnswer = () => {
    const question = quizData[currentQuestion];
    setAnswered(answered + 1);
    
    if (selectedAnswer === question.correct) {
      setScore(score + 1);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion + 1 >= quizData.length) {
        setQuizComplete(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
  };

  if (quizComplete) {
    return (
      <>
        <div className="hero">
          <div className="hero-content">
            <h1 className="fade-in">
              <i className="fas fa-trophy"></i> Quiz Complete!
            </h1>
            <p className="slide-up">Congratulations on completing the fraud detection practice</p>
          </div>
        </div>
        
        <div className="container">
          <div className="score bounce-in">
            <h2><i className="fas fa-medal"></i> Final Results</h2>
            <div className="score-number">{score}/{answered}</div>
            <div className={`status-indicator ${score/answered >= 0.8 ? 'status-safe' : score/answered >= 0.6 ? 'status-medium' : 'status-high'}`}>
              {score/answered >= 0.8 ? '🌟 Excellent!' : score/answered >= 0.6 ? '👍 Good Job!' : '📚 Keep Learning!'}
            </div>
            <p>Great job practicing fraud detection. Review the questions to reinforce your learning.</p>
          </div>
          
          <div className="text-center mt-5">
            <button className="btn primary-btn" onClick={resetQuiz}>
              <i className="fas fa-redo"></i> Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <>
      <div className="hero">
        <div className="hero-content">
          <h1 className="fade-in">
            <i className="fas fa-dumbbell"></i> Practice Fraud Detection
          </h1>
          <p className="slide-up">Test your skills with interactive fraud detection scenarios</p>
        </div>
      </div>
      
      <div className="container">
        <div className="score slide-up">
          <h2><i className="fas fa-trophy"></i> Your Progress</h2>
          <div className="score-number">{score}/{answered}</div>
          <p>Keep practicing to master fraud detection skills!</p>
        </div>

        <div className="quiz-card fade-in">
          <div className="question">
            <div className="flex justify-between items-center mb-4">
              <span className="status-indicator" style={{background: '#e2e8f0', color: '#4a5568'}}>
                Question {currentQuestion + 1} of {quizData.length}
              </span>
              <div className="status-indicator status-info">
                <i className="fas fa-clock"></i> Practice Mode
              </div>
            </div>
            <h3>{question.question}</h3>
          </div>
          
          <div className="text-sample">
            <i className="fas fa-quote-left"></i>
            {question.text}
          </div>
          
          <div className="options">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`option ${
                  selectedAnswer === index ? 'selected' : ''
                } ${
                  showResult && index === question.correct ? 'correct' : ''
                } ${
                  showResult && selectedAnswer === index && index !== question.correct ? 'incorrect' : ''
                }`}
                onClick={() => selectOption(index)}
              >
                <i className={`fas ${
                  showResult && index === question.correct ? 'fa-check-circle' :
                  showResult && selectedAnswer === index && index !== question.correct ? 'fa-times-circle' :
                  selectedAnswer === index ? 'fa-dot-circle' : 'fa-circle'
                }`}></i>
                {option}
              </div>
            ))}
          </div>
          
          {!showResult && (
            <div className="text-center mt-4">
              <button 
                className="btn primary-btn" 
                onClick={submitAnswer} 
                disabled={selectedAnswer === null}
              >
                <i className="fas fa-paper-plane"></i> Submit Answer
              </button>
            </div>
          )}
          
          {showResult && (
            <div className={`result ${selectedAnswer === question.correct ? 'correct' : 'incorrect'} bounce-in`}>
              <div className="flex items-center gap-3 mb-3">
                <i className={`fas ${selectedAnswer === question.correct ? 'fa-check-circle' : 'fa-times-circle'}`} style={{fontSize: '1.5rem'}}></i>
                <strong>{selectedAnswer === question.correct ? 'Correct!' : 'Incorrect'}</strong>
              </div>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>

        <div className="text-center mt-5">
          <button className="btn btn-secondary" onClick={resetQuiz}>
            <i className="fas fa-redo"></i> Reset Quiz
          </button>
        </div>
      </div>
    </>
  );
}

export default Practice;