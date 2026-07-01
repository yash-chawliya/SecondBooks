import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// This component now requires a backend server to interact with the Twilio API securely.
// An example Node.js/Express server is provided in the comments at the end of this file.

function PhoneLogin() {
    // Component State
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showOtpView, setShowOtpView] = useState(false);
    const [loading, setLoading] = useState({ send: false, verify: false });
    const { login, setName } = useAuth();

    // --- Helper function to display messages ---
    const displayMessage = (text, type) => {
        setMessage({ text, type });
    };

    // --- Function to Send OTP ---
    // This function now calls our backend server, which then calls Twilio.
    const handleSendOtp = async () => {
        if (!phoneNumber || phoneNumber.length !== 10) {
            displayMessage("Please enter a valid 10-digit phone number.", 'error');
            return;
        }

        setLoading({ ...loading, send: true });
        displayMessage('Sending OTP...', 'info');

        try {
            const fullPhoneNumber = "+91" + phoneNumber;

            // API call to our backend's /send-otp endpoint
            const response = await fetch('/api/otp/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: fullPhoneNumber }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowOtpView(true);
                displayMessage(data.message, 'success');
            } else {
                throw new Error(data.message || 'Failed to send OTP.');
            }

        } catch (error) {
            console.error("Error sending OTP:", error);
            displayMessage(error.message, 'error');
        } finally {
            setLoading({ ...loading, send: false });
        }
    };

    // --- Function to Verify OTP ---
    // This function calls our backend server to verify the code with Twilio.
    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            displayMessage("Please enter the 6-digit OTP.", 'error');
            return;
        }

        setLoading({ ...loading, verify: true });
        displayMessage('Verifying OTP...', 'info');

        try {
            const fullPhoneNumber = "+91" + phoneNumber;


            // API call to our backend's /verify-otp endpoint
            const response = await fetch('/api/otp/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: fullPhoneNumber, otp: otp }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                displayMessage('Login Successful!', 'success');
                // Here you would typically handle successful login (e.g., set user state, redirect)
                setShowOtpView(false); // Optionally hide the form
                const user = await axios.get(`/api/users/check/${phoneNumber}`)
                if(!user.data.success){
                    alert("User is not registered.")
                    return navigate('/login')
                }
                const userId = user.data.userId
                login(userId)
                // const details = await axios.get(`/api/users/details/${userId}`)
                setName(user.data.firstName)
                navigate('/')
            } else {
                throw new Error(data.message || 'Invalid OTP.');
            }

        } catch (error) {
            console.error("Error verifying OTP:", error);
            displayMessage(error.message, 'error');
        } finally {
            setLoading({ ...loading, verify: false });
        }
    };

    // --- Dynamic Class for Message Styling ---
    const getMessageClass = () => {
        if (message.type === 'success') return 'text-green-600';
        if (message.type === 'error') return 'text-red-600';
        return 'text-blue-600';
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-800">Login with Phone</h1>

                {!showOtpView ? (
                    // Step 1: Phone Number View
                    <div id="phone-view" className="space-y-4">
                        <div>
                            <label htmlFor="phone-number" className="text-sm font-medium text-gray-700">Phone Number</label>
                            <div className="flex items-center mt-1">
                                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md h-10">
                                    +91
                                </span>
                                <input
                                    type="tel"
                                    id="phone-number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 h-10"
                                    placeholder="9876543210"
                                />
                            </div>
                        </div>
                        <button onClick={handleSendOtp} disabled={loading.send} className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium disabled:bg-blue-400">
                            {loading.send ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                ) : (
                    // Step 2: OTP View
                    <div id="otp-view" className="space-y-4">
                        <div>
                            <label htmlFor="otp-input" className="text-sm font-medium text-gray-700">Enter OTP</label>
                            <input
                                type="text"
                                id="otp-input"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="123456"
                            />
                        </div>
                        <button onClick={handleVerifyOtp} disabled={loading.verify} className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium disabled:bg-green-400">
                            {loading.verify ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                )}

                {/* Message Area */}
                {message.text && (
                    <div className={`text-center text-sm font-medium ${getMessageClass()}`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PhoneLogin;


/*
// ---------------------------------------------------------------------------------
// --- REQUIRED BACKEND SERVER (Example using Node.js, Express, and Twilio) ---
// ---------------------------------------------------------------------------------
// You CANNOT call the Twilio API directly from the frontend. It would expose your secret keys.
// You must create a simple backend server like the one below.
//
// To run this server:
// 1. Create a new folder for your backend.
// 2. Run `npm init -y`
// 3. Run `npm install express twilio cors dotenv`
// 4. Create a file named `server.js` and paste this code into it.
// 5. Create a file named `.env` and add your Twilio credentials.
// 6. Run `node server.js`
// 7. In your React app's `package.json`, add a proxy: "proxy": "http://localhost:3001"
//    This will forward the `/api` requests from React to your backend server.
//

// --- .env file ---
// TWILIO_ACCOUNT_SID=AC8bdef4c488a003585258102d01e96650
// TWILIO_AUTH_TOKEN=your_auth_token
// TWILIO_VERIFY_SERVICE_SID= VAa738284ad9ef1f8fb85b27bd564638d5


// --- server.js ---
/*


const port = process.env.PORT || 3001;

// --- Twilio Client Initialization ---
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);


// --- API Endpoint to Send OTP ---
app.post('/api/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
        return res.status(400).json({ success: false, message: 'Phone number is required.' });
    }

    try {
        const verification = await client.verify.v2.services(verifyServiceSid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });
        
        console.log('Verification SID:', verification.sid);
        res.status(200).json({ success: true, message: 'OTP sent successfully!' });

    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP.', error: error.message });
    }
});


// --- API Endpoint to Verify OTP ---
app.post('/api/verify-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ success: false, message: 'Phone number and OTP are required.' });
    }

    try {
        const verificationCheck = await client.verify.v2.services(verifyServiceSid)
            .verificationChecks
            .create({ to: phoneNumber, code: otp });

        if (verificationCheck.status === 'approved') {
            res.status(200).json({ success: true, message: 'OTP verified successfully!' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid OTP.' });
        }

    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP.', error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
*/
