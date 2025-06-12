// write a function that return "textverify" message 
import React, { useState, useEffect } from 'react';
import './Textverify.css';
import { useNavigate } from 'react-router-dom';
import { securityQuestions } from '../../assets/securityQuestions.js';

function Textverify() {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [usedQuestions, setUsedQuestions] = useState(new Set());
    const [attempts, setAttempts] = useState(0);
    const MAX_ATTEMPTS = 3;
    
    const getRandomQuestion = () => {
        const availableQuestions = securityQuestions.filter(q => !usedQuestions.has(q.question));
        
        // If all questions have been used, reset the used questions set
        if (availableQuestions.length === 0) {
            setUsedQuestions(new Set());
            return securityQuestions[Math.floor(Math.random() * securityQuestions.length)];
        }
        
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const newQuestion = availableQuestions[randomIndex];
        
        // Add the question to used questions set
        setUsedQuestions(prev => new Set([...prev, newQuestion.question]));
        
        return newQuestion;
    };

    useEffect(() => {
        // Set initial question
        setCurrentQuestion(getRandomQuestion());
    }, []);

    const handleAnswerSelect = (option) => {
        setSelectedAnswer(option);
        setVerificationStatus(null); // Clear previous status when new answer is selected
    };
    
    const handleVerify = () => {
        if (!selectedAnswer) {
            alert('Please select an answer');
            return;
        }

        if (currentQuestion.answer === selectedAnswer) {
            setVerificationStatus('success');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000); // Reduced timeout to 2 seconds for better UX
        } else {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            
            if (newAttempts >= MAX_ATTEMPTS) {
                setVerificationStatus('aborted');
                // Redirect to dashboard after showing the aborted message
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
                return;
            }

            setVerificationStatus('failed');
            // Wait for a short delay before showing new question
            setTimeout(() => {
                setCurrentQuestion(getRandomQuestion());
                setSelectedAnswer('');
                setVerificationStatus(null);
            }, 1500); // Show error message for 1.5 seconds before refreshing
        }
    };
    
    if (!currentQuestion) {
        return <div className="textverify-container">Loading...</div>;
    }

    return (
        <div className="textverify-container">
            <h2>Security Verification</h2>
            {attempts < MAX_ATTEMPTS && (
                <div className="attempts-info">
                    Attempts remaining: {MAX_ATTEMPTS - attempts}
                </div>
            )}
            <div className="question-section">
                <h3>{currentQuestion.question}</h3>
                <div className="options-container">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={verificationStatus === 'success' || verificationStatus === 'aborted'}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
            <button 
                className="verify-button" 
                onClick={handleVerify}
                disabled={verificationStatus === 'success' || verificationStatus === 'aborted'}
            >
                Verify
            </button>
            {verificationStatus && (
                <div className={`status-message ${verificationStatus}`}>
                    {verificationStatus === 'success' 
                        ? 'Fund transfer successful! Redirecting...' 
                        : verificationStatus === 'aborted'
                        ? 'VERIFICATION FAILED. TRANSACTION ABORTED!'
                        : 'Verification failed. Loading new question...'}
                </div>
            )}
        </div>
    );
}

export default Textverify;