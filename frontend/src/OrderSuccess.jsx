import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import correct from './assets/correct.svg'
import { useAuth } from './AuthContext';

import axios from 'axios';

// --- Mock Data & Components ---
// This allows the component to be testable without a real AuthContext.
// You should replace this with your actual import: `import { useAuth } from './AuthContext';`
// const useAuth = () => ({ name: 'Yash' }); 

// Mock asset for demonstration. Replace with your actual import.
// const correct = 'https://placehold.co/24x24/34d399/ffffff?text=✔';

const OrderSuccess = () => {
    const { name } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const orderId = searchParams.get('order'); 
    
    const [details, setDetails] = useState(null);
    const [book, setBook] = useState(null);
    const [error, setError] = useState(null);
    // Add a loading state for better UX
    const [loading, setLoading] = useState(true);

    // --- DATA FETCHING EFFECT ---
    useEffect(() => {
        // Only run the fetch call if an orderId is present in the URL
        if (!orderId) {
            setError("No Order ID found in the URL. Please check the link.");
            setLoading(false);
            return; // Stop execution if there's no orderId
        }

        const fetchOrderAndBook = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Fetch the order details first
                const orderResponse = await axios.get(`/api/getorder/${orderId}`);
                const orderData = orderResponse.data;
                setDetails(orderData); 

                // 2. Get the bookId from the order response data
                const bookIdToFetch = orderData.orderBookId;
                if (!bookIdToFetch) {
                    // This handles cases where the order might not have a book ID
                    throw new Error("Order data did not contain a book ID.");
                }

                // 3. Fetch the book details using the retrieved bookId
                const bookResponse = await axios.get(`/api/books/${bookIdToFetch}`);
                setBook(bookResponse.data);

            } catch (err) {
                setError('Failed to fetch order details. Please ensure the server is running and the order ID is correct.');
                console.error("Error fetching data:", err);
            } finally {
                // This runs whether the try block succeeded or failed
                setLoading(false); 
            }
        };

        fetchOrderAndBook();
        // This effect depends on orderId. It will re-run if the URL parameter changes.
    }, [orderId]); 

    // --- RENDER LOGIC ---

    // Show a loading message while data is being fetched
    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 text-lg">Loading order details...</div>;
    }

    // Show an error message if something went wrong
    if (error) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 text-red-600 text-lg p-4 text-center">{error}</div>;
    }

    // Render the success page once all data is loaded
    return (
        <div className='bg-gray-100 w-full min-h-screen p-4 sm:p-8 flex items-center justify-center'>
            <div className='bg-white h-auto w-full max-w-4xl mx-auto px-6 py-8 rounded-lg shadow-md'>
                <div>
                    Hey <b>{name || 'Customer'}</b>,
                </div>
                <div className='flex items-center text-xl gap-3 text-green-500 mt-4'>
                    <img src={correct} alt="Success" className="w-6 h-6" />
                    <span>Your order is confirmed!</span>
                </div>
                <div className='mt-2 pb-4 border-b text-gray-600'>
                    Thanks for shopping! Your order will be shipped soon. Happy studying!
                </div>
                
                {/* SAFE ACCESS: Check if 'details' exists before accessing its properties */}
                <div className='font-semibold mt-6 text-lg'>
                    Order: #{details?.orderId}
                </div>

                <div className='flex flex-col sm:flex-row mt-6 rounded-lg border p-4 gap-6'>
                    {/* <div className='flex-shrink-0 border-5 border'> */}
                        {/* SAFE ACCESS: Use optional chaining and provide a fallback image */}
                        <img 
                            src={book?.imageUrls[0] || 'https://placehold.co/300x400/e0e0e0/333333?text=No+Image'} 
                            alt={book?.bookDescription || 'Book cover'} 
                            className='my-auto' style={{ height: '280px', width: "200px" }} 
                        />
                    {/* </div> */}
                    <div className='flex-grow'>
                        {/* SAFE ACCESS: Use optional chaining (?.) and fallbacks to prevent crashes */}
                        <div className='text-lg text-gray-800 font-semibold mb-2'>{book?.bookDescription || 'Book description not available.'}</div>
                        <div className='font-bold text-xl mb-2'>Order Total: ₹{details?.amountPaid}</div>
                        <div className='font-semibold text-gray-700'>To be delivered by {details?.expectedDeliveryDate}</div>
                    </div>
                </div>

                <div className='text-center mt-8'>
                    <button className='w-full sm:w-auto px-6 py-2 text-blue-500 hover:underline focus:outline-none' onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;
