import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Import the custom hook
import { useNavigate, useLocation } from 'react-router-dom';


const AuthComponent = () => {

    const navigate = useNavigate();
    const location = useLocation(); // Get the location object to find out where the user came from


    const { login, itemToAddAfterLogin, setName } = useAuth(); // Get the login function from the context

    // State to toggle between Login and Sign Up modes
    const [isLoginMode, setIsLoginMode] = useState(true);

    // State for all form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    // State for messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const from = location.state?.from?.pathname || '/';


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const endpoint = isLoginMode ? 'login' : 'register';
        // Use relative path for deployed app
        const url = `/api/auth/phone/${endpoint}`;

        // Create the correct payload based on the mode
        const payload = isLoginMode
            ? { phone, password } // FIX: Use 'phone' state for login
            : { firstName, lastName, phone, email, password };

        try {
            const response = await axios.post(url, payload);
            setSuccess(response.data.message);

            if (isLoginMode) {
                const userId = response.data.userId;
                login(userId); // Set the global state to logged in

                // Add item to cart if one was pending
                if (itemToAddAfterLogin) {
                    const adding = await axios.post(`/api/cart/add/${itemToAddAfterLogin}`, { userId });
                    alert(adding.data.message);
                }

                // Fetch user's name
                const details = await axios.get(`/api/users/details/${userId}`);
                setName(details.data.firstName);

                // Redirect the user to their original page (or the homepage)
                navigate(from, { replace: true });
            } else {
                // Switch to login after successful signup
                setIsLoginMode(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    const switchModeHandler = () => {
        setIsLoginMode((prevMode) => !prevMode);
        // Clear all fields and messages when switching modes
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setPassword('');
        setError('');
        setSuccess('');
    };

    return (
        <form onSubmit={handleSubmit} className='m-auto w-[400px] border text-center mt-[60px] p-4 rounded-lg shadow-lg'>
            <div className='font-bold text-[24px] my-[20px]'>{isLoginMode ? 'LOGIN' : 'CREATE AN ACCOUNT'}</div>

            {/* --- Conditional Fields for Sign Up --- */}
            {!isLoginMode && (
                <>
                    <div className="flex items-center gap-3 rounded-md border border-gray-300 px-4 py-2 bg-white shadow-sm w-[300px] m-auto mb-[10px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#6B7280"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" /></svg>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required className="outline-none bg-transparent w-full" />
                    </div>
                    <div className="flex items-center gap-3 rounded-md border border-gray-300 px-4 py-2 bg-white shadow-sm w-[300px] m-auto mb-[10px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#6B7280"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" /></svg>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required className="outline-none bg-transparent w-full" />
                    </div>
                    {/* Email Input for Registration */}
                    <div className="flex items-center gap-3 rounded-md border border-gray-300 px-4 py-2 bg-white shadow-sm w-[300px] m-auto mb-[10px]">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#6B7280" aria-hidden="true"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200Z" /></svg>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="outline-none bg-transparent w-full" />
                    </div>
                </>
            )}

            {/* --- Phone Number Input (for both Login and Sign Up) --- */}
            <div className="flex items-center gap-3 rounded-md border border-gray-300 px-4 py-2 bg-white shadow-sm w-[300px] m-auto">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#6B7280"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 28t-11 21l-97 98q20 39 47.5 75.5T333-360q36 36 72 63.5T480-250l98-97q9-9 21-11t28-1l140 26q13 2 22.5 13t9.5 25v162q0 18-12 30t-30 12Z" /></svg>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required className="outline-none bg-transparent w-full" />
            </div>

            {/* Password Input */}
            <div className="flex items-center gap-3 rounded-md border border-gray-300 px-4 py-2 bg-white shadow-sm w-[300px] m-auto mt-[10px]">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#6B7280" aria-hidden="true"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" /></svg>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="outline-none bg-transparent w-full" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-3 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1" aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" /></svg>
                    )}
                </button>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">{success}</p>}

            <div>
                <button type="submit" className='px-[50px] py-[10px] border font-bold text-[20px] my-[20px] bg-yellow-400 hover:bg-yellow-500 rounded-lg'>
                    {isLoginMode ? 'LOGIN' : 'CREATE ACCOUNT'}
                </button>
            </div>

            <div className='pb-4'>
                {isLoginMode ? 'Not a member? ' : 'Already have an account? '}
                <button type="button" onClick={switchModeHandler} className='underline text-blue-600 hover:text-blue-800'>
                    {isLoginMode ? 'Sign up now' : 'Login'}
                </button>
            </div>
            <div className='cursor-pointer hover:underline hover:text-blue-500' onClick={() => {
                navigate('/loginwithphone')
            }}>Login with phone.</div>
        </form>
    );
};

export default AuthComponent;
