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
      <div className="container">
        <h1 className="page-title"><i className="fas fa-dumbbell"></i> Practice Fraud Detection</h1>
        <div className="score">
          <h2>Quiz Complete!</h2>
          <div className="score-number">{score}/{answered}</div>
          <p>Great job practicing fraud detection. Review the questions to reinforce your learning.</p>
        </div>
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <button className="btn" onClick={resetQuiz}>
            <i className="fas fa-redo"></i> Reset Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = quizData[currentQuestion];

  return (
    <div className="container">
      <h1 className="page-title"><i className="fas fa-dumbbell"></i> Practice Fraud Detection</h1>

      <div className="score">
        <h2>Your Score</h2>
        <div className="score-number">{score}/{answered}</div>
        <p>Keep practicing to improve your fraud detection skills!</p>
      </div>

      <div className="quiz-card">
        <div className="question">
          <strong>Question {currentQuestion + 1}:</strong> {question.question}
        </div>
        <div className="text-sample">{question.text}</div>
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
              {option}
            </div>
          ))}
        </div>
        {!showResult && (
          <button 
            className="btn" 
            onClick={submitAnswer} 
            disabled={selectedAnswer === null}
          >
            Submit Answer
          </button>
        )}
        {showResult && (
          <div className={`result ${selectedAnswer === question.correct ? 'correct' : 'incorrect'}`}>
            <i className={`fas ${selectedAnswer === question.correct ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
            {selectedAnswer === question.correct ? ' Correct! ' : ' Incorrect. '}
            {question.explanation}
          </div>
        )}
      </div>

      <div style={{textAlign: 'center', marginTop: '2rem'}}>
        <button className="btn" onClick={resetQuiz}>
          <i className="fas fa-redo"></i> Reset Quiz
        </button>
      </div>
    </div>
  );
}

export default Practice;