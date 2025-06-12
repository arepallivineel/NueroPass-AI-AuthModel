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
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    useEffect(() => {
        // Randomly select a question when component mounts
        const randomIndex = Math.floor(Math.random() * securityQuestions.length);
        setCurrentQuestion(securityQuestions[randomIndex]);
    }, []);

    const handleAnswerSelect = (option) => {
        setSelectedAnswer(option);
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
            setVerificationStatus('failed');
        }
    };

    if (!currentQuestion) {
        return <div className="voiceandtextverify-container">Loading...</div>;
    }

    return (
        <div className="voiceandtextverify-container">
            <h2>Voice and Text Verification</h2>
            
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
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
                <button className="verify-button" onClick={handleVerify}>
                    Verify Answer
                </button>
                {verificationStatus && (
                    <div className={`status-message ${verificationStatus}`}>
                        {verificationStatus === 'success' 
                            ? 'Security question verified successfully!' 
                            : 'Incorrect answer. Please try again.'}
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
                            disabled={isRecording}
                        >
                            Start Recording
                        </button>
                    ) : (
                        <button 
                            className="record-button recording"
                            onClick={stopRecording}
                        >
                            Stop Recording
                        </button>
                    )}
                    {recordingComplete && (
                        <button 
                            className="submit-button"
                            onClick={handleVoiceVerification}
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

            {verificationStatus === 'success' && voiceMatchStatus === 'success' && (
                <div className="final-status success">
                    Fund transfer successful! Redirecting to dashboard...
                </div>
            )}
        </div>
    );
}

export default Voiceandtextverify;