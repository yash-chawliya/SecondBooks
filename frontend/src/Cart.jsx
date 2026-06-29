import React from 'react'
import { useAuth } from './AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Cart = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cartBooks, setCartBooks] = useState([]);
    const navigate = useNavigate();
    const { userId, isLoggedIn } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const fetchCartDetails = async () => {
            if (!isLoggedIn || !userId) {
                navigate('/login', { state: { from: location } });
                return;
            }

            try {
                const cartResponse = await axios.get(`/api/cart/${userId}`);
                const bookIdsInCart = cartResponse.data.cart;

                if (bookIdsInCart && bookIdsInCart.length > 0) {
                    const booksResponse = await axios.post('/api/books/bulk', {
                        bookIds: bookIdsInCart
                    });
                    setCartBooks(booksResponse.data);
                } else {
                    setCartBooks([]);
                }
            } catch (err) {
                setError('Failed to fetch cart details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchCartDetails();
        } else {
            // If there's no user, we can stop loading immediately.
            setLoading(false);
        }
    }, [userId, isLoggedIn, navigate, location]);

    const removeFromCart = async (bookId) => {
        try {
            const remove = await axios.post(`/api/cart/remove/${bookId}`, { userId });
            toast.success(remove.data.message);
            // Refresh cart by filtering out the removed book
            setCartBooks(prevBooks => prevBooks.filter(book => book.bookId !== bookId));
        } catch (error) {
            toast.error("Failed to remove item.");
            console.error(error);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading Your Cart...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    // Calculate subtotal
    const subtotal = cartBooks.reduce((total, book) => total + book.newPriceDiscount, 0);

    return (
        <div className="p-2 md:p-4 flex flex-col h-[calc(100vh-80px)]"> {/* Assuming 80px navbar height */}
            <Toaster position="top-right" />
            <h1 className="text-2xl md:text-3xl font-bold mb-4 flex-shrink-0">Your Cart</h1>

            {cartBooks.length > 0 ? (
                <div className="flex flex-col lg:flex-row gap-4 flex-grow overflow-hidden">
                    {/* On mobile, subtotal is on top. On desktop, it's on the right. */}
                    <div className="w-full lg:w-1/4 order-1 lg:order-2">
                        <div className="border rounded-lg p-4 lg:sticky top-4 bg-white shadow-sm">
                            <h2 className="text-lg font-semibold">Subtotal ({cartBooks.length} items):</h2>
                            <p className="text-2xl font-bold my-2">₹{subtotal}</p>
                            <button
                                className="bg-yellow-400 w-full rounded-full py-2 font-semibold hover:bg-yellow-500 transition-colors"
                                onClick={() => alert('Proceed to checkout for all items (functionality to be built).')}
                            >
                                Proceed to Buy All
                            </button>
                        </div>
                    </div>
                    {/* Cart Items - Now Scrollable */}
                    <div className="w-full lg:w-3/4 overflow-y-auto pr-2 order-2 lg:order-1">
                        {cartBooks.map((book) => {
                            const newDiscountPercent = Math.round(((book.newPrice - book.newPriceDiscount) / book.newPrice) * 100);
                            const preOwnedDiscountPercent = Math.round(((book.preOwnedPrice - book.preOwnedPriceDiscount) / book.preOwnedPrice) * 100);

                            return (
                                // --- THIS IS THE FIX ---
                                <div key={book.bookId} className='w-full border bg-white rounded-lg p-4 mb-4 flex flex-col md:flex-row gap-4 md:h-[250px] shadow-sm'>
                                    <img
                                        src={book.imageUrls[0]}
                                        alt={book.bookDescription}
                                        className='w-full md:w-48 h-64 md:h-full object-contain cursor-pointer self-center flex-shrink-0'
                                        onClick={() => navigate(`/book/${book.bookId}`)}
                                    />
                                    <div className="flex-grow flex flex-col">
                                        {/* This wrapper div will grow to push the buttons down */}
                                        <div className="flex-grow">
                                            <div className='text-lg font-semibold cursor-pointer hover:text-blue-600 line-clamp-2' onClick={() => navigate(`/book/${book.bookId}`)}>
                                                {book.bookDescription}
                                            </div>
                                            <div className='text-sm text-gray-600 mt-1'>by {book.author.join(', ')}</div>
                                            <div className='grid grid-cols-2 gap-2 text-center'>
                                                <button className='border border-gray-300 p-1 rounded-md hover:border-gray-500' onClick={() => navigate(`/book/${book.bookId}?type=new`)}>
                                                    <div className='text-xs font-semibold border-b border-b-gray-500'>New</div>
                                                    <div><span className='text-base font-bold'>₹{book.newPriceDiscount}</span><span className='ml-1 line-through text-xs text-gray-500'>₹{book.newPrice}</span><span><div className='inline-block font-xs ml-2 text-green-600 font-semibold'>({newDiscountPercent}% off)</div></span></div>
                                                </button>
                                                <button className='border border-gray-300 p-1 rounded-md hover:border-gray-500' onClick={() => navigate(`/book/${book.bookId}?type=preowned`)}>
                                                    <div className='text-xs font-semibold border-b border-b-gray-500'>Pre-Owned</div>
                                                    <div><span className='text-base font-bold'>₹{book.preOwnedPriceDiscount}</span><span className='ml-1 line-through text-xs text-gray-500'>₹{book.preOwnedPrice}</span><span><div className='inline-block font-xs ml-2 text-green-600 font-semibold'>({preOwnedDiscountPercent}% off)</div></span></div>
                                                </button>
                                            </div>
                                        </div>
                                        {/* This is the button container that will be pushed to the bottom */}
                                        <div className='flex gap-4 mt-2'>
                                            <button className='bg-red-500 text-white rounded-md px-4 py-2 text-sm font-semibold hover:bg-red-600 transition-colors' onClick={() => removeFromCart(book.bookId)}>
                                                Remove
                                            </button>
                                            <button className='bg-yellow-400 rounded-md px-4 py-2 text-sm font-semibold hover:bg-yellow-500 transition-colors' onClick={() => navigate(`/book/${book.bookId}/payment?type=new`)}>
                                                Proceed to Buy
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
                    <p className="mt-2">Check out our trending books to find your next read!</p>
                    <button onClick={() => navigate('/')} className="mt-4 bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700">
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;

