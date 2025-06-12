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
    
    useEffect(() => {
        // Randomly select a question when component mounts
        const randomIndex = Math.floor(Math.random() * securityQuestions.length);
        setCurrentQuestion(securityQuestions[randomIndex]);
    }, []);

    const handleAnswerSelect = (option) => {
        setSelectedAnswer(option);
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
            }, 2000);
        } else {
            setVerificationStatus('failed');
        }
    };
    
    if (!currentQuestion) {
        return <div className="textverify-container">Loading...</div>;
    }

    return (
        <div className="textverify-container">
            <h2>Security Verification</h2>
            <div className="question-section">
                <h3>{currentQuestion.question}</h3>
                <div className="options-container">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
            <button className="verify-button" onClick={handleVerify}>
                Verify
            </button>
            {verificationStatus && (
                <div className={`status-message ${verificationStatus}`}>
                    {verificationStatus === 'success' 
                        ? 'Fund transfer successful! Redirecting...' 
                        : 'Verification failed. Please try again.'}
                </div>
            )}
        </div>
    );
}

export default Textverify;