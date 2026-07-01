import React from 'react';
import logo from './assets/logo_color2.png';
import cart from './assets/shopping_cart.png';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast, { Toaster } from 'react-hot-toast';

// Helper function to dynamically load the Razorpay script
const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};


const ConfirmOrder = () => {
    const { userId, orderAddress, orderPaymentType, name, userPhoneNumber, deliveryInstruction } = useAuth();
    const navigate = useNavigate();
    const { bookId } = useParams();
    const [searchParams] = useSearchParams();

    const [deliveryFee, SetdeliveryFee] = useState(49);
    const [pgFee, SetpgFee] = useState(0);
    const [discount, Setdiscount] = useState(49);

    const [quantity, Setquantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [book, setBook] = useState(null);

    useEffect(() => {
        // Guard clause to prevent API calls if critical info is missing
        if (!orderAddress) {
            toast.error("Please select an address.");
            // Use searchParams to preserve the purchase type on redirect
            navigate(`/book/${bookId}/payment?type=${searchParams.get('type')}`);
            return;
        }

        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`/api/books/${bookId}`);
                setBook(response.data);
            } catch (error) {
                console.error("Failed to fetch book details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [bookId, orderAddress, orderPaymentType, navigate, searchParams]);

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (!book) return <div className="text-center p-10">Book not found.</div>;

    const purchaseType = searchParams.get('type');
    const totalItemAmount = purchaseType === 'new' ? book.newPriceDiscount * quantity : book.preOwnedPriceDiscount * quantity;
    const totalAmountBeforeDiscount = totalItemAmount + deliveryFee + pgFee;
    const totalAmountAfterDiscount = totalAmountBeforeDiscount - discount;


    // --- Combined Order and Payment Handler ---
    const handlePlaceOrder = async () => {
        // --- This function now only handles Razorpay payments ---
        const scriptLoaded = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!scriptLoaded) {
            toast.error("Payment gateway failed to load. Please try again.");
            return;
        }

        const orderResponse = await axios.post('/api/payments/razorpay-order', {
            amount: totalAmountAfterDiscount * 100,
            currency: 'INR',
        });

        const { amount, id: order_id, currency } = orderResponse.data;

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: amount.toString(),
            currency: currency,
            name: "SecondBooks",
            description: `Payment for ${book.bookDescription}`,
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    orderDetails: {
                        userId,
                        orderBookId: bookId,
                        phone: userPhoneNumber || "9876543210", // Fallback phone
                        itemAmount: totalItemAmount,
                        paymentGatewayFee: pgFee,
                        discount,
                        deliveryFee,
                        amountPaid: totalAmountAfterDiscount,
                        paymentOption: "Razorpay", // Correctly use the selected payment type
                        shippingAddress: orderAddress,
                        deliveryInstruction: deliveryInstruction,
                    }
                };

                const verificationResult = await axios.post('/api/payments/verify', data);

                if (verificationResult.data.success) {
                    navigate(`/ordersuccessful?order=${verificationResult.data.orderId}`);
                } else {
                    toast.error("Payment verification failed. Please contact support.");
                }
            },
            prefill: {
                name: name,
                contact: userPhoneNumber || "9876543210" // Fallback phone
            },
            theme: {
                color: "#2563EB" // A blue theme color
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <div className='bg-gray-100 min-h-screen'>
            <Toaster position="top-right" />
            <div className='flex items-center justify-between h-20 border-b mb-2 px-4 md:px-8 bg-white'>
                <img src={logo} alt="Logo" className='w-16 h-16 md:w-20 md:h-20 cursor-pointer' onClick={() => navigate('/')} />
                <div className='text-xl md:text-3xl font-semibold text-center'>Secure checkout</div>
                <div className='flex items-center justify-center gap-2 cursor-pointer text-base md:text-xl font-semibold' onClick={() => navigate('/cart')}>
                    <img src={cart} alt="Cart" className='h-7 md:h-8' />
                    <span className="hidden sm:inline">Cart</span>
                </div>
            </div>

            <div className='flex flex-col md:flex-row p-2 md:p-4 gap-4'>
                {/* --- Main Content (Left side on Desktop) --- */}
                <div className='w-full md:w-2/3 space-y-4 order-2 md:order-1'>

                    {/* Delivery Info */}
                    <div className='border bg-white p-4 rounded-lg shadow-sm'>
                        <div className='text-lg font-bold'>Delivering to</div>
                        <div className='w-full mt-1 text-sm text-gray-600'>{orderAddress}</div>
                        {deliveryInstruction && (
                             <div className='mt-2 pt-2 border-t text-sm'><b className='font-semibold'>Instructions:</b> {deliveryInstruction}</div>
                        )}
                    </div>

                    {/* Item Review */}
                    <div className='border bg-white mt-4 flex p-4 rounded-lg shadow-sm'>
                        <img src={book.imageUrls[0]} alt={book.bookDescription} className='my-auto object-contain flex-shrink-0' style={{ height: '160px', width: "110px" }} />
                        <div className='mt-2 ml-4'>
                            <div className='text-base font-medium mb-2'>{book.bookDescription}</div>
                            <div className='text-sm text-gray-600'><b>Quantity:</b> {quantity}</div>
                             <div className='text-sm text-gray-600'><b>Condition:</b> {purchaseType === 'new' ? 'New' : 'Pre-Owned'}</div>
                        </div>
                    </div>
                </div>

                {/* --- Order Summary (Right side on Desktop) --- */}
                <div className='w-full md:w-1/3 bg-white p-4 border rounded-lg shadow-sm h-max md:sticky top-4 order-1 md:order-2'>
                    <button className='bg-yellow-400 rounded-full text-base font-semibold w-full py-3 mb-4 hover:bg-yellow-500 transition-colors' onClick={handlePlaceOrder}>
                        Place your order
                    </button>
                    <div className='text-xs text-center mb-4'>By placing your order, you agree to our policies.</div>
                    <div className='space-y-1 text-sm'>
                        <div className='flex justify-between border-t pt-2'>
                            <span>Items:</span>
                            <span>₹{totalItemAmount}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Delivery:</span>
                            <span>₹{deliveryFee}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Payment Fee:</span>
                            <span>₹{pgFee}</span>
                        </div>
                        <div className='flex justify-between text-green-600'>
                            <span>Free delivery:</span>
                            <span>-₹{deliveryFee}</span>
                        </div>
                        <div className='flex justify-between font-bold text-lg border-t pt-2 mt-2'>
                            <span>Order Total:</span>
                            <span>₹{totalAmountAfterDiscount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmOrder;
