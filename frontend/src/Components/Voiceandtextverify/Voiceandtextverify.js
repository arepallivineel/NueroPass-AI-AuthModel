// write a function that return "voiceandtextverify" message 

import React, { useState, useEffect, useRef } from 'react';
import './Voiceandtextverify.css';
import { useNavigate } from 'react-router-dom';
import { securityQuestions } from '../../assets/securityQuestions.js';
import voice1File from '../../assets/voice1.wav';

function Voiceandtextverify() {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingComplete, setRecordingComplete] = useState(false);
    const [voiceMatchStatus, setVoiceMatchStatus] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [usedQuestions, setUsedQuestions] = useState(new Set());
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
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
        setCurrentQuestion(getRandomQuestion());
    }, []);

    const handleAnswerSelect = (option) => {
        setSelectedAnswer(option);
        setVerificationStatus(null);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setAudioBlob(blob);
                setRecordingComplete(true);
                
                // Stop all audio tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingComplete(false);
            setAudioBlob(null);
            setVoiceMatchStatus(null);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Error accessing microphone. Please ensure microphone permissions are granted.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleVoiceVerification = async () => {
        if (!audioBlob) {
            alert('Please record your voice first');
            return;
        }
    
        try {
            const formData = new FormData();
            
            // Fetch the voice1.wav file and add it to formData
            const voice1Response = await fetch(voice1File);
            const voice1Blob = await voice1Response.blob();
            formData.append('file1', voice1Blob);
            
            // Add the newly recorded voice2
            formData.append('file2', audioBlob);
    
            const response = await fetch('http://127.0.0.1:8000/voice_similarity/', {
                method: 'POST',
                body: formData
            });
    
            const result = await response.json();
    
            const isVoiceMatch = result.result === 1;
            setVoiceMatchStatus(isVoiceMatch ? 'success' : 'failed');
    
            if (isVoiceMatch && verificationStatus === 'success') {
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (error) {
            console.error('Error during voice verification:', error);
            setVoiceMatchStatus('failed');
        }
    };

    const handleVerify = () => {
        if (!selectedAnswer) {
            alert('Please select an answer');
            return;
        }

        if (currentQuestion.answer === selectedAnswer) {
            setVerificationStatus('success');
            if (voiceMatchStatus === 'success') {
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
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
            }, 1500);
        }
    };

    if (!currentQuestion) {
        return <div className="voiceandtextverify-container">Loading...</div>;
    }

    return (
        <div className="voiceandtextverify-container">
            <h2>Voice and Text Verification</h2>
            
            {attempts < MAX_ATTEMPTS && (
                <div className="attempts-info">
                    Attempts remaining: {MAX_ATTEMPTS - attempts}
                </div>
            )}
            
            <div className="verification-section">
                <h3>1. Security Question</h3>
                <div className="question-section">
                    <h4>{currentQuestion.question}</h4>
                    <div className="options-container">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={verificationStatus === 'aborted'}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    className="verify-button" 
                    onClick={handleVerify}
                    disabled={verificationStatus === 'aborted'}
                >
                    Verify Answer
                </button>
                {verificationStatus && (
                    <div className={`status-message ${verificationStatus}`}>
                        {verificationStatus === 'success' 
                            ? 'Security question verified successfully!' 
                            : verificationStatus === 'aborted'
                            ? 'VERIFICATION FAILED. TRANSACTION ABORTED!'
                            : 'Incorrect answer. Loading new question...'}
                    </div>
                )}
            </div>

            <div className="verification-section">
                <h3>2. Voice Verification</h3>
                <p className="voice-instruction">Please record your voice for verification</p>
                <div className="recording-controls">
                    {!isRecording ? (
                        <button 
                            className="record-button"
                            onClick={startRecording}
                            disabled={isRecording || verificationStatus === 'aborted'}
                        >
                            Start Recording
                        </button>
                    ) : (
                        <button 
                            className="record-button recording"
                            onClick={stopRecording}
                            disabled={verificationStatus === 'aborted'}
                        >
                            Stop Recording
                        </button>
                    )}
                    {recordingComplete && (
                        <button 
                            className="submit-button"
                            onClick={handleVoiceVerification}
                            disabled={verificationStatus === 'aborted'}
                        >
                            Submit Voice Recording
                        </button>
                    )}
                </div>
                {recordingComplete && (
                    <div className="recording-status">Recording complete! Click submit to verify.</div>
                )}
                {voiceMatchStatus && (
                    <div className={`status-message ${voiceMatchStatus}`}>
                        {voiceMatchStatus === 'success' 
                            ? 'Voice verification successful!' 
                            : 'Voice verification failed. Please try again.'}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Voiceandtextverify;