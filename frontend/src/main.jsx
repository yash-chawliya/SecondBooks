import React from 'react';
import ReactDOM from 'react-dom/client'; // FIX 1: Import from 'react-dom/client'
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './AuthContext.jsx';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || '';

// FIX 2: Call createRoot on the ReactDOM object
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
  </React.StrictMode>
);