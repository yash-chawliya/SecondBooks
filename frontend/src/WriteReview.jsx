import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast, { Toaster } from 'react-hot-toast';

// Star Icon Component
const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <svg
        className={`w-8 h-8 cursor-pointer ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const WriteReview = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { userId, isLoggedIn } = useAuth();

    const [order, setOrder] = useState(null);
    // const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                // This API needs to exist and return the combined order + book details
                const response = await axios.get(`/api/orders/${orderId}`);
                const book = await axios.get(`/api/books/${response.data.orderBookId}`)
                setOrder(book.data);
            } catch (error) {
                toast.error("Could not fetch order details.");
                console.error("Fetch order error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, isLoggedIn, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || !reviewText.trim()) {
            toast.error("Please provide a rating and a review.");
            return;
        }

        const payload = {
            orderId: orderId,
            bookId: order.bookId,
            rating,
            reviewText,
        };

        const promise = axios.post('/api/reviews/submit', payload);

        toast.promise(promise, {
            loading: 'Submitting your review...',
            success: (response) => {
                setTimeout(() => navigate('/orders'), 2000);
                return response.data.message;
            },
            error: (error) => {
                return error.response?.data?.message || 'Failed to submit review.';
            }
        });
    };

    if (loading) {
        return <div className="text-center p-10">Loading Order...</div>;
    }
    if (!order) {
        return <div className="text-center p-10">Order or Book details not found.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <Toaster position="top-right" />
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Write a Review</h1>

                {/* Product Info */}
                <div className="flex items-center border-b pb-4 mb-4">
                    <img
                        src={order.imageUrls[0]}
                        alt={order.bookDescription}
                        className="w-20 h-28 object-contain flex-shrink-0 mr-4"
                    />
                    <div>
                        <p className="font-semibold text-gray-700">{order.bookDescription}</p>
                        <p className="text-sm text-gray-500">Order ID: {orderId}</p>
                    </div>
                </div>

                {/* Review Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">Your Rating</label>
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                    key={star}
                                    filled={hoverRating >= star || rating >= star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reviewText" className="block text-lg font-medium text-gray-700 mb-2">Your Review</label>
                        <textarea
                            id="reviewText"
                            rows="6"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="What did you like or dislike? What did you use this product for?"
                            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-yellow-400 text-black font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 shadow-md"
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WriteReview;

