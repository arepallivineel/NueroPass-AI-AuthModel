import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUniversity, FaShieldAlt, FaMobileAlt, FaClock } from 'react-icons/fa';
import './Homepage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <div className="bank-icon">
          <FaUniversity />
        </div>
        <h1>Welcome to Chase NueroPass</h1>
        <p>Secure banking with advanced voice and text verification</p>
        
        <button className="login-button" onClick={() => navigate('/login')}>
          Get Started
        </button>

        <div className="features-section">
          <div className="feature-card">
            <FaShieldAlt size={30} color="#1976d2" />
            <h3>Enhanced Security</h3>
            <p>Multi-factor authentication with voice and text verification</p>
          </div>

          <div className="feature-card">
            <FaMobileAlt size={30} color="#1976d2" />
            <h3>Easy Access</h3>
            <p>Seamless banking experience across all devices</p>
          </div>

          <div className="feature-card">
            <FaClock size={30} color="#1976d2" />
            <h3>24/7 Banking</h3>
            <p>Access your account anytime, anywhere</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;