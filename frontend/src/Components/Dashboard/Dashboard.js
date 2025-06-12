//write a function for dashboard that returns a div with the text Dashboard and a button to logout. The button should have the text Logout and a class of logout-button. The div should have a form with a heading of "Fund Transfer" Under that it should show fields like Account number , Acount folder name , amount and Trasnfer button and after that if the amount is greater than 0 it should show a message "Transfer Successful" and if the amount is less than or equal to 1Lakh it should redirect to Voiceandtextverify.js otherwise it should redirect to Textverify.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FaSignOutAlt, FaMoneyBillWave, FaUser, FaBuilding } from 'react-icons/fa';

function Dashboard() {
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [amount, setAmount] = useState('');
    const [transferMessage, setTransferMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();
    
    const handleLogout = () => {
        navigate('/');
    };
    
    const handleTransfer = (e) => {
        e.preventDefault();
        if (amount > 0) {
            setMessageType('success');
            setTransferMessage('Transfer Successful');
            setTimeout(() => {
                if (parseFloat(amount) <= 100000) {
                    navigate('/textverify');
                } else {
                    navigate('/voiceandtextverify');
                }
            }, 1500);
        } else {
            setMessageType('error');
            setTransferMessage('Amount must be greater than 0');
        }
    };
    
    return (
        <div className="dashboard-container">
            <h1>
                <FaBuilding style={{ marginRight: '10px' }} />
                Dashboard
            </h1>
            <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt style={{ marginRight: '5px' }} />
                Logout
            </button>

            <form className="transfer-form" onSubmit={handleTransfer}>
                <h2>
                    <FaMoneyBillWave style={{ marginRight: '10px' }} />
                    Fund Transfer
                </h2>
                
                <div className="input-group">
                    <label>Account Number</label>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="Enter account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Account Holder Name</label>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="Enter account holder name"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Amount (₹)</label>
                    <input
                        className="input-field"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="transfer-button">
                    <FaMoneyBillWave style={{ marginRight: '5px' }} />
                    Transfer Funds
                </button>
            </form>

            {transferMessage && (
                <div className={`transfer-message ${messageType}`}>
                    {transferMessage}
                </div>
            )}
        </div>
    );
}

export default Dashboard;