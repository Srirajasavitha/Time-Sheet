import React, { useEffect, useState } from 'react';
import './TimeSheetForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Timesheet = () => {
    const [userIdInput, setUserIdInput] = useState('');
    const [userPasswordInput, setUserPasswordInput] = useState('');
    const [asciiUserId, setAsciiUserId] = useState('');
    const [asciiPassword, setAsciiPassword] = useState('');
    const [processedResult, setProcessedResult] = useState('');
    const [showAscii, setShowAscii] = useState(false);
    const [randomNumber, setRandomNumber] = useState(6); 
    const navigate = useNavigate(); 

    const convertToAscii = (input) => {
        return input.split('').map((char) => char.charCodeAt(0)).join(' ');
    };

    const processAsciiValues = (inputAsciiArray, randomValue) => {
        let processed = '';
        for (let i = 0; i < inputAsciiArray.length; i++) {
            if ((i + 1) % 2 !== 0) {
                processed += (inputAsciiArray[i] + randomValue).toString() + ' ';
            } else {
                processed += (inputAsciiArray[i] - randomValue).toString() + ' ';
            }
        }
        return processed.trim(); 
    };

    useEffect(() => {
        axios.get('https://6e00-2401-4900-6271-fd23-99d6-95eb-19a0-7898.ngrok-free.app/api/tasks/generate-random')
            .then((response) => {
                setRandomNumber(response.data.randomNumber);
            })
            .catch((error) => {
                console.error('There was an error fetching the random number:', error);
            });
    }, []); 

    const handleShowAscii = () => {
        if (!userIdInput || !userPasswordInput || randomNumber === null) {
            alert('Please enter both User ID and Password, and ensure the random number is loaded.');
            return;
        }

        const userIdAsciiArray = userIdInput.split('').map((char) => char.charCodeAt(0));
        const passwordAsciiArray = userPasswordInput.split('').map((char) => char.charCodeAt(0));
        const separatorArray = "///".split('').map((char) => char.charCodeAt(0));

        const processedUserIdResult = processAsciiValues(userIdAsciiArray, randomNumber);
        const processedPasswordResult = processAsciiValues(passwordAsciiArray, randomNumber);
        const separatorResult = processAsciiValues(separatorArray, randomNumber);

        const finalProcessedResult = `${processedUserIdResult} ${separatorResult} ${processedPasswordResult}`;
        setAsciiUserId(convertToAscii(userIdInput));
        setAsciiPassword(convertToAscii(userPasswordInput));
        setProcessedResult(finalProcessedResult);
        setShowAscii(true);
        axios.post('https://6e00-2401-4900-6271-fd23-99d6-95eb-19a0-7898.ngrok-free.app/api/tasks', { processedResult: finalProcessedResult })
            .then((response) => {
                if (response.data && response.data.processedResult) {
                    setProcessedResult(response.data.processedResult);
                } else {
                    console.warn('No processedResult found in the response:', response.data);
                }
            })
            .catch((error) => {
                console.error('There was an error posting the processed result:', error);
            });
            navigate('/dashboard');
    };
    return (
        <div className="container">
            <div className="left-section">
                <h1 className="company-name">RAISON AUTOMATION</h1>
            </div>
            <div className="right-section">
                <h1>Welcome Back!</h1>
                <form onSubmit={handleShowAscii}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={userIdInput}
                        onChange={(e) => setUserIdInput(e.target.value)}
                        placeholder="Enter your username"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={userPasswordInput}
                        onChange={(e) => setUserPasswordInput(e.target.value)}
                        placeholder="Enter your password"
                    />
                    <button type="submit">Log In</button>
                </form>
                {showAscii && (
                <div>
                    <p><strong>ASCII values:</strong></p>
                    <p>User ID: {asciiUserId}</p>
                    <p>Password: {asciiPassword}</p>
                    <p><strong>Processed Results:</strong> {processedResult}</p>
                </div>
            )}
            </div>
        </div>
    );
};

export default Timesheet;
