//write a function that returns a div with the text Login Page which asks for username and password and a button to submit the form. The button should have the text Login. The div should have a class of login-container and the button should have a class of login-button. The input fields should have a class of login-input. The function should be called Login and after clicking submit it should check whther those detials are avaible in public/src/assets/credentials.js and if they are it should redirect to the Dashboard.js otherwise it should show an error message.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { credentials } from '../../assets/credentials.js';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = credentials.find(
      (cred) => cred.username === username && cred.password === password
    );

    if (user) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-icon">
        <FaUser />
      </div>
      <h2>Welcome Back</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <div className="input-icon">
            <FaUser />
          </div>
          <input
            type="text"
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <div className="input-icon">
            <FaLock />
          </div>
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          <FaSignInAlt style={{ marginRight: '8px' }} />
          Login
        </button>
      </form>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

export default Login;