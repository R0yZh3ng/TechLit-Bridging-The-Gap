import React, { useState, useRef } from 'react';

const CallTester = () => {
    const [scenario, setScenario] = useState(null);
    const [difficulty, setDifficulty] = useState('medium');
    const [loading, setLoading] = useState(false);
    const [userAnswer, setUserAnswer] = useState(null);
    const [identifiedFlags, setIdentifiedFlags] = useState([]);
    const [testResult, setTestResult] = useState(null);
    const [includeAudio, setIncludeAudio] = useState(false);
    const audioRef = useRef(null);

    const generateTest = async () => {
        setLoading(true);
        setScenario(null);
        setTestResult(null);
        setUserAnswer(null);
        setIdentifiedFlags([]);

        try {
            const response = await fetch('http://localhost:8000/api/practice/call-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    difficulty, 
                    include_audio: includeAudio 
                })
            });

            if (!response.ok) throw new Error('Failed to generate test');
            
            const data = await response.json();
            setScenario(data);
        } catch (error) {
            console.error('Error generating test:', error);
            alert('Failed to generate test. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        if (userAnswer === null) {
            alert('Please select whether this is a scam or not');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/practice/call-test/${scenario.test_id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    is_scam: userAnswer,
                    identified_flags: identifiedFlags
                })
            });

            if (!response.ok) throw new Error('Failed to submit answer');
            
            const result = await response.json();
            setTestResult(result);
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer. Please try again.');
        }
    };

    const toggleFlag = (flag) => {
        setIdentifiedFlags(prev => 
            prev.includes(flag) 
                ? prev.filter(f => f !== flag)
                : [...prev, flag]
        );
    };

    const playAudio = () => {
        if (scenario?.scenario?.audio?.audio_data && audioRef.current) {
            const audioBlob = new Blob([
                Uint8Array.from(atob(scenario.scenario.audio.audio_data), c => c.charCodeAt(0))
            ], { type: 'audio/mp3' });
            
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
            audioRef.current.play();
        }
    };

    return (
        <div className="container">
            <div className="component-container slide-up">
                <div className="component-header">
                    <h2>🎭 Fake Call Testing</h2>
                    <p>Practice identifying scam calls with AI-generated scenarios</p>
                </div>

                <div className="card">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Difficulty Level:</label>
                            <select 
                                className="form-control"
                                value={difficulty} 
                                onChange={(e) => setDifficulty(e.target.value)}
                                disabled={loading}
                            >
                                <option value="easy">🟢 Easy</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="hard">🔴 Hard</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    checked={includeAudio}
                                    onChange={(e) => setIncludeAudio(e.target.checked)}
                                    disabled={loading}
                                />
                                🔊 Include AI-generated audio
                            </label>
                        </div>
                    </div>

                    <div className="text-center">
                        <button 
                            onClick={generateTest} 
                            disabled={loading}
                            className="btn primary-btn"
                        >
                            {loading ? '⏳ Generating...' : '🎲 Generate Test Call'}
                        </button>
                    </div>
                </div>

                {scenario && (
                    <div className="card fade-in mt-4">
                        <div className="alert alert-info">
                            <h3 className="flex items-center gap-2 mb-3">
                                📞 Incoming Call
                            </h3>
                            <div className="grid" style={{gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                                <p><strong>📱 Caller ID:</strong> {scenario.scenario.caller_id}</p>
                                <p><strong>👤 Caller Name:</strong> {scenario.scenario.caller_name}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4 className="mb-3">💬 Call Script:</h4>
                            <div className="detailed-analysis">
                                <p>"{scenario.scenario.script}"</p>
                            </div>
                        </div>

                        {scenario.scenario.audio && (
                            <div className="mt-4 p-4 rounded-lg" style={{background: '#f0fff4'}}>
                                <button onClick={playAudio} className="btn btn-secondary">
                                    🔊 Play Audio
                                </button>
                                <audio ref={audioRef} controls style={{display: 'none'}} />
                                {scenario.scenario.audio.note && (
                                    <p className="mt-2 text-sm" style={{color: '#666'}}>{scenario.scenario.audio.note}</p>
                                )}
                            </div>
                        )}

                        {!testResult && (
                            <div className="alert alert-warning mt-4">
                                <h4 className="mb-4">🤔 Your Assessment:</h4>
                                
                                <div className="form-group">
                                    <p className="form-label">Is this a scam call?</p>
                                    <div className="flex gap-4 mt-2">
                                        <label className="flex items-center gap-2">
                                            <input 
                                                type="radio" 
                                                name="scam" 
                                                value="true"
                                                onChange={() => setUserAnswer(true)}
                                            />
                                            ⚠️ Yes, this is a scam
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input 
                                                type="radio" 
                                                name="scam" 
                                                value="false"
                                                onChange={() => setUserAnswer(false)}
                                            />
                                            ✅ No, this is legitimate
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group mt-4">
                                    <p className="form-label">🚩 Identify red flags (bonus points):</p>
                                    <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem'}}>
                                        {scenario.scenario.red_flags.map(flag => (
                                            <label key={flag} className="flex items-center gap-2">
                                                <input 
                                                    type="checkbox"
                                                    checked={identifiedFlags.includes(flag)}
                                                    onChange={() => toggleFlag(flag)}
                                                />
                                                {flag}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="text-center mt-4">
                                    <button 
                                        onClick={submitAnswer}
                                        className="btn"
                                        disabled={userAnswer === null}
                                        style={{background: userAnswer === null ? '#ccc' : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'}}
                                    >
                                        📝 Submit Answer
                                    </button>
                                </div>
                            </div>
                        )}

                        {testResult && (
                            <div className={`alert mt-4 bounce-in ${testResult.correct ? 'alert-success' : 'alert-error'}`}>
                                <div className="result-header">
                                    <h4>📊 Test Result</h4>
                                    <div className={`status-indicator ${testResult.correct ? 'status-safe' : 'status-fraud'}`}>
                                        {testResult.correct ? '✅ Correct!' : '❌ Incorrect'}
                                    </div>
                                </div>
                                
                                <div className="result-content">
                                    <div className="flex justify-between items-center mb-3">
                                        <p><strong>🎯 Score:</strong> {testResult.score}/100</p>
                                        <div className="status-indicator status-info">
                                            {testResult.score >= 80 ? '🌟 Excellent' : testResult.score >= 60 ? '👍 Good' : '📚 Keep Learning'}
                                        </div>
                                    </div>
                                    <p><strong>💬 Feedback:</strong> {testResult.feedback}</p>
                                    
                                    <div className="recommendations mt-4">
                                        <h5>📚 Learning Points:</h5>
                                        <ul>
                                            {testResult.learning_points.map((point, index) => (
                                                <li key={index}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="text-center mt-4">
                                        <button 
                                            onClick={generateTest}
                                            className="btn primary-btn"
                                        >
                                            🔄 Try Another Call
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}


            </div>
        </div>
    );
};

export default CallTester;