import React, { useState } from 'react';
import axios from 'axios';
import './SmartCertificateForm.css';

const SmartCertificateForm = () => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [showStatusBox, setShowStatusBox] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Check if the wallet address exists
            const response = await axios.get(`https://portal-testnet.maschain.com/api/wallet/wallet/${walletAddress}`, {
                headers: {
                    'client_id': '9b16ae5638534ae1961fb370f874b6cc',
                    'client_secret': 'sk_9b16ae5638534ae1961fb370f874b6cc',
                    'Content-Type': 'application/json'
                }
            }); 

            console.log(response); // Debugging line to inspect the response

            if (response.data.status === 200 && response.data.result) {
                setStatus('Wallet address exists.');
            } else {
                setStatus('Wallet address does not exist.');
            }
        } catch (error) {
            console.error('Error checking wallet address:', error.response ? error.response.data : error.message);
            setStatus('Error checking wallet address.');
        }

        setShowStatusBox(true); // Show the status box
    };

    const handleCloseStatusBox = () => {
        setShowStatusBox(false); // Hide the status box and remove the blur effect
    };

    return (
        <div className="form-wrapper">
            <div className={`form-container ${showStatusBox ? 'blurred' : ''}`}>
                <h2>Check Wallet Address</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="walletAddress">Wallet Address:</label>
                        <input
                            id="walletAddress"
                            type="text"
                            className="input-box"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Your Full Name:</label>
                        <input
                            id="name"
                            type="text"
                            className="input-box"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Your Email:</label>
                        <input
                            id="email"
                            type="text"
                            className="input-box"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fileUpload">Proof of Qualification:</label>
                        <input
                            id="fileUpload"
                            type="file"
                            className="input-box"
                            onChange={handleFileChange}
                        />
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>

            {showStatusBox && (
                <div className="status-overlay">
                    <div className="status-box">
                        <p>{status}</p>
                        <button onClick={handleCloseStatusBox} className="status-ok-button">OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartCertificateForm;
