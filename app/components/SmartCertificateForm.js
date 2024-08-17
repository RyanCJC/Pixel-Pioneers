import React, { useState } from 'react';
import axios from 'axios';

const SmartCertificateForm = () => {
    const [name, setName] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [showStatusBox, setShowStatusBox] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Check if the wallet address exists
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/wallet/wallet/${walletAddress}`, {
                headers: {
                    'client_id': process.env.NEXT_PUBLIC_CLIENT_ID,
                    'client_secret': process.env.NEXT_PUBLIC_CLIENT_SECRET,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === 200 && response.data.result) {
                setStatus('Thank you. Our team will review your form and contact you through email.');
            }
        } catch (error) {
            setStatus('Wallet not existed. Please make sure credentials entered are correct.');
        }

        setShowStatusBox(true); // Show the status box
    };

    const handleCloseStatusBox = () => {
        setShowStatusBox(false); // Hide the status box and remove the blur effect
    };

    return (
        <div style={styles.formWrapper}>
            <div style={{ ...styles.formContainer, filter: showStatusBox ? 'blur(5px)' : 'none' }}>
                <h2 style={styles.h2}>Enter your credentials here</h2>
                <br />
                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="walletAddress" style={styles.label}>Wallet Address:</label>
                        <input
                            id="walletAddress"
                            type="text"
                            style={styles.inputBox}
                            value={walletAddress}
                            placeholder='0x695d22...'
                            onChange={(e) => setWalletAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="name" style={styles.label}>Your Full Name:</label>
                        <input
                            id="name"
                            type="text"
                            style={styles.inputBox}
                            value={name}
                            placeholder='John Lee'
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>Your Email:</label>
                        <input
                            id="email"
                            type="email"
                            style={styles.inputBox}
                            value={email}
                            placeholder='example123@mail.com'
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="fileUpload" style={styles.label}>Proof of Qualification:</label>
                        <input
                            id="fileUpload"
                            type="file"
                            style={styles.inputBox}
                            onChange={handleFileChange}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            ...styles.submitButton,
                            ...(isHovered && !isActive ? styles.submitButtonHover : {}),
                            ...(isActive ? styles.submitButtonActive : {}),
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onMouseDown={() => setIsActive(true)}
                        onMouseUp={() => setIsActive(false)}
                    >
                        Submit
                    </button>
                </form>
            </div>

            {showStatusBox && (
                <div style={styles.statusOverlay}>
                    <div style={styles.statusBox}>
                        <p>{status}</p>
                        <button onClick={handleCloseStatusBox} style={styles.statusOkButton}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    formWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        backgroundColor: '#f4f4f4',
    },
    h2: {
        fontWeight: 'bold',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        transition: 'filter 0.3s ease',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#333333',
    },
    inputBox: {
        width: '100%',
        padding: '10px',
        border: '1px solid #cccccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    submitButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#047857',
        border: 'none',
        color: 'white',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    submitButtonHover: {
        backgroundColor: '#035e43',
        transform: 'scale(1.02)',
    },
    submitButtonActive: {
        backgroundColor: '#065f46',
        transform: 'scale(0.98)',
    },
    statusOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    statusBox: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    statusOkButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        border: 'none',
        color: 'white',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default SmartCertificateForm;
