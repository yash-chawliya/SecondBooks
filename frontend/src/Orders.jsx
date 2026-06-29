import React from 'react'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import down from './assets/down_arrow.svg'
import buyagain from "./assets/buyagain.png"
import axios from 'axios';

const Orders = () => {
    const { userId, name } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [orders, setOrders] = useState([])

    // Redirect to login if user is not available.
    // This should be done before the component tries to render.
    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate]);


    useEffect(() => {
        // Prevent API call if userId is not yet available
        if (!userId) {
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await axios.get(`/api/${userId}/orders`);
                setOrders(response.data);
            } catch (err) {
                setError('Failed to fetch orders. Please make sure the server is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]); // Dependency array now only contains userId

    function formatDateWithoutYear(dateString) {
        const date = new Date(dateString);
        const options = {
            month: 'long',
            day: '2-digit'
        };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100 text-lg">Loading order details...</div>;
    }
    
    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    return (
        <div className='flex justify-center mt-4 md:mt-10 px-2 md:px-4'>
            <div className='w-full max-w-5xl'>
                <div className='text-2xl md:text-3xl font-bold mb-4'>YOUR ORDERS</div>

                {orders.length > 0 ? (
                    orders.map((order) => {
                        const formattedDate = formatDateWithoutYear(order.createdAt);
                        return (
                            <div key={order._id} className='w-full mx-auto rounded-lg border border-gray-300 mb-6 shadow-sm'>
                                <div className='upper flex flex-col md:flex-row justify-between bg-gray-100 p-3 rounded-t-lg text-sm'>
                                    <div className='flex flex-wrap gap-x-6 gap-y-2'>
                                        <div className='text-left'>
                                            <div className='uppercase text-xs text-gray-600'>ORDER PLACED</div>
                                            <div className='font-medium'>{formattedDate}</div>
                                        </div>
                                        <div className='text-left'>
                                            <div className='uppercase text-xs text-gray-600'>TOTAL</div>
                                            <div className='font-medium'>₹{order.amountPaid}</div>
                                        </div>
                                        <div className='text-left'>
                                            <div className='uppercase text-xs text-gray-600'>SHIP TO</div>
                                            <div className='flex items-center font-medium text-blue-600 cursor-pointer'>{name} <img src={down} alt="" className="h-4 w-4" /></div>
                                        </div>
                                    </div>
                                    <div className='text-left md:text-right mt-2 md:mt-0'>
                                        <div className='uppercase text-xs text-gray-600'>ORDER # {order.orderId}</div>
                                        <div className='flex gap-2 text-blue-600'>
                                            <span className='hover:underline cursor-pointer'>View order details</span>
                                            <span>|</span>
                                            <span className='hover:underline cursor-pointer'>Invoice</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='lower flex flex-col md:flex-row justify-between mt-1 p-4'>
                                    <div className="w-full md:w-2/3">
                                        <div className='mb-2 font-bold text-lg'>Status: {order.orderStatus}</div>
                                        <div className='flex gap-4'>
                                            <div className='flex-shrink-0'>
                                                {order.bookDetails ? (
                                                    <img src={order.bookDetails.imageUrls[0]} alt={order.bookDetails.bookDescription} className="h-28 w-20 object-contain border rounded" />
                                                ) : (
                                                    <div className="h-28 w-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Image</div>
                                                )}
                                            </div>
                                            <div className='flex flex-col justify-between'>
                                                <div className='text-sm font-semibold text-blue-700 hover:underline cursor-pointer line-clamp-3' onClick={() => navigate(`/book/${order.orderBookId}`)}>
                                                    {order.bookDetails ? order.bookDetails.bookDescription : "Book not available"}
                                                </div>
                                                <div className='flex flex-col sm:flex-row gap-2 mt-2'>
                                                    <button
                                                        className='relative border border-gray-300 rounded-full w-36 py-1 text-xs flex justify-center items-center bg-yellow-300 hover:bg-yellow-400 font-semibold'
                                                        onClick={() => navigate(`/book/${order.orderBookId}`)}
                                                    >
                                                        <img src={buyagain} alt="buy again" className='h-5 w-5 mr-1'/>
                                                        Buy it again
                                                    </button>
                                                    <button className='border border-gray-300 rounded-full w-36 py-1 text-xs hover:bg-gray-100' onClick={() => navigate(`/book/${order.orderBookId}`)}>
                                                        View your item
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full md:w-1/3 mt-4 md:mt-0 flex flex-col gap-2'>
                                        <button className='border border-gray-300 rounded-lg w-full py-2 text-sm hover:bg-gray-100'>Leave delivery feedback</button>
                                        <button className='border border-gray-300 rounded-lg w-full py-2 text-sm hover:bg-gray-100' onClick={() => navigate(`/write-review/${order.orderId}`)}>Write product review</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                ) : (
                     <div className="text-center py-10 text-gray-500">You have no past orders.</div>
                )}
            </div>
        </div>
    )
}

export default Orders;

