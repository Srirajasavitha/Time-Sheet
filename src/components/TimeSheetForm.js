import React, { useEffect, useState } from 'react';
import './TimeSheetForm.css';
import axios from 'axios';

const Timesheet = () => {
    const [userIdInput, setUserIdInput] = useState('');
    const [userPasswordInput, setUserPasswordInput] = useState('');
    const [asciiUserId, setAsciiUserId] = useState('');
    const [asciiPassword, setAsciiPassword] = useState('');
    const [processedResult, setProcessedResult] = useState('');
    const [showAscii, setShowAscii] = useState(false);
    const [randomNumber, setRandomNumber] = useState(null); 

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

    axios.get('https://api.example.com')
        .then((response) => {
            setUserIdInput(response.data.userIdInput);
        })
        .catch((error) => {
            console.error('There was an error fetching the userid:', error);
        });

    axios.get('https://api.example.com')
        .then((response) => {
            setUserPasswordInput(response.data.userPasswordInput);
        })
        .catch((error) => {
            console.error('There was an error fetching the password:', error);
        });

    useEffect(() => {
        axios.get('https://api.example.com')
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
        axios.post('https://api.example.com/processed-result', { processedResult: finalProcessedResult })
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
    };

    const handleUserIdChange = (event) => {
        setUserIdInput(event.target.value);
    };

    const handleUserPasswordChange = (event) => {
        setUserPasswordInput(event.target.value);
    };

    return (
        <div className="timesheet-container">
            <img 
                src="https://raisonautomation.com/wp-content/uploads/2024/08/RAISON_LOGO_-_2K24.png" 
                alt="RAISON Automation Logo" 
                className="logo" 
            />
            <h1>Timesheet</h1>
            <form>
                <label>
                    User ID:
                    <input 
                        type="text" 
                        value={userIdInput} 
                        onChange={handleUserIdChange} 
                        placeholder="Enter User ID" 
                    />
                </label>
                <br /><br />
                <label>
                    Password:
                    <input 
                        type="password" 
                        value={userPasswordInput} 
                        onChange={handleUserPasswordChange} 
                        placeholder="Enter Password" 
                    />
                </label>
                <br /><br />
                <button type="button" onClick={handleShowAscii}>
                    Submit
                </button>
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
    );
};

export default Timesheet;
