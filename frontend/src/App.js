import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import Voiceandtextverify from './Components/Voiceandtextverify/Voiceandtextverify';
import Textverify from './Components/Textverify/Textverify';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/voiceandtextverify" element={<Voiceandtextverify />} />
        <Route path="/textverify" element={<Textverify />} />
        {/* Add more routes as needed */}


      </Routes>
    </Router>
  );
}

export default App;