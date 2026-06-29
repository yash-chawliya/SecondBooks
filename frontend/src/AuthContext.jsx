import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Create a custom hook to make it easier to use the context
export const useAuth = () => {
  return useContext(AuthContext);

};


// Create the Provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // 1. New state for user ID
  const [cart, setCart] = useState([]);
  const [orderAddress, setOrderAddress] = useState('')
  const [orderPaymentType, setOrderPaymentType] = useState('')
  const [userPhoneNumber, setUserPhoneNumber] = useState('')
  const [itemToAddAfterLogin, setItemToAddAfterLogin] = useState(null);
  const [name, setName] = useState('');
  const [deliveryInstruction, setDeliveryInstruction] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add this line for confirmation
    console.log("AuthContext: Attempting to verify session...");

    const verifySession = async () => {
      try {
        const response = await axios.get('/api/verify-session');
        if (response.status === 200) {
          // console.log("AuthContext: Session verified successfully.");
          await login(response.data.userId);
        }
      } catch (error) {
        console.log('AuthContext: No active session found.');
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);


  const login = async (id) => {
    setUserId(id);
    setIsLoggedIn(true);
    // You can also fetch user details here after logging in
    try {
      const details = await axios.get(`/api/getDetails/${id}`);
      setName(details.data.firstName);
      setUserPhoneNumber(details.data.phone);
    } catch (error) {
      console.error("Failed to fetch user details on login", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout'); // Tell the backend to clear the cookie
    } catch (error) {
      console.error("Logout failed:", error);
    }
    setUserId(null);
    setIsLoggedIn(false);
    setName('');
    setUserPhoneNumber('')
    setDeliveryInstruction('')
  };

  const value = {
    isLoggedIn,
    userId,
    name, setName,
    cart, setCart,
    login,
    logout,
    itemToAddAfterLogin, setItemToAddAfterLogin,
    orderAddress, setOrderAddress,
    orderPaymentType, setOrderPaymentType,
    userPhoneNumber,
    deliveryInstruction, setDeliveryInstruction,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


