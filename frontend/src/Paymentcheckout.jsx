import React from 'react'
import logo from './assets/logo_color2.png'
import cart from './assets/shopping_cart.png'
import jee from './assets/jee.png'
import { useState, useEffect } from 'react'
import add from './assets/add.svg'
import deletesvg from './assets/delete.svg'
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';




const Paymentcheckout = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, Setquantity] = useState(1);
    const [deliveryFee, SetdeliveryFee] = useState(49)
    const [pgFee, SetpgFee] = useState(0)
    const [discount, Setdiscount] = useState(49)
    const [searchParams] = useSearchParams();
    const [allAddress, setAllAddress] = useState([])
    const { orderAddress, setOrderAddress, userId, setOrderPaymentType, orderPaymentType, isLoggedIn, deliveryInstruction, setDeliveryInstruction } = useAuth();
    const [showInstructions, setShowInstructions] = useState(false); // State to toggle instructions textarea


    // Get the 'type' from the URL query string
    const purchaseType = searchParams.get('type');

    useEffect(() => {
        const fetchBookDetails = async () => {
            // Guard clause to prevent API calls if userId is not yet available
            // if (!userId) {
            //     return;
            // }
            try {
                if (!isLoggedIn) {
                    navigate('/login', { state: { from: location } })
                }
                const response = await axios.get(`/api/books/${bookId}`);
                const responseAddress = await axios.get(`/api/get/address/${userId}`);
                setBook(response.data);
                setAllAddress(responseAddress.data);
            } catch (error) {
                console.error("Failed to fetch book details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails()
    }, [bookId, userId, isLoggedIn, navigate, location]);

    if (loading) return <div>Loading...</div>;
    if (!book) return <div>Book not found.</div>;
    
    const totalItemAmount = purchaseType === 'new' ? book.newPriceDiscount * quantity : book.preOwnedPriceDiscount * quantity
    const totalAmountBeforeDiscount = totalItemAmount + deliveryFee + pgFee
    const totalAmountAfterDiscount = totalItemAmount + deliveryFee + pgFee - discount

    const handleadd = () => {
        Setquantity(quantity + 1)
    }

    const handledelete = () => {
        if (quantity > 1) {
            Setquantity(quantity - 1)
        }
    }

    return (
        <div className='bg-gray-100'>
            <Toaster position="top-right" />
            <div className='flex items-center justify-between h-[80px] border-b-[1px] mb-2 px-4 md:px-5 bg-white'>
                <img src={logo} alt="Logo" className='w-16 h-16 md:w-20 md:h-20 cursor-pointer' onClick={() => navigate('/')}/>
                <div className='text-2xl md:text-4xl font-semibold text-center'>Secure Checkout</div>
                <div className='flex items-center justify-center gap-2 cursor-pointer text-lg md:text-2xl font-semibold' onClick={() => navigate('/cart')}>
                    <img src={cart} alt="Cart" className='h-8 md:h-10' />
                    <span className="hidden sm:inline">Cart</span>
                </div>
            </div>

            <div className='flex flex-col md:flex-row p-2 md:p-4 gap-4'>

                {/* --- Main Content (Left side on Desktop) --- */}
                <div className='w-full md:w-[70%] space-y-4'>

                    {/* Address Section */}
                    <div className='border-2 bg-white p-3 rounded-lg'>
                        <div className='flex justify-between items-center'>
                            <div className='text-lg font-bold'>Delivering to Yash</div>
                            <div className='text-sm underline text-blue-600 cursor-pointer' onClick={() => navigate('/address')}>
                                Add an address
                            </div>
                        </div>
                        {allAddress.length > 0 ? (
                            allAddress.map((address, index) => (
                                <div key={index} className='flex items-center gap-3 border border-gray-300 rounded-md mt-2 p-3'>
                                    <input type="radio" name="addressNumber" className="form-radio h-5 w-5 text-yellow-600" onClick={() => setOrderAddress(address)} />
                                    <label className='text-sm w-full'>{address}</label>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-5 text-gray-500">No address saved.</div>
                        )}
                        <div className='text-blue-600 text-sm mt-3 cursor-pointer' onClick={() => setShowInstructions(!showInstructions)}>
                            {showInstructions ? 'Hide delivery instructions' : 'Add delivery instructions'}
                        </div>
                        {showInstructions && (
                            <div className="mt-2">
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    maxLength="150"
                                    placeholder="e.g., Leave package at the front door."
                                    value={deliveryInstruction}
                                    onChange={(e) => setDeliveryInstruction(e.target.value)}
                                />
                                <p className="text-right text-xs text-gray-500 mt-1">
                                    {150 - (deliveryInstruction ? deliveryInstruction.length : 0)} characters remaining
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Payment Method Section */}
                    
                    
                    {/* Item Review Section */}
                    <div className='border-2 bg-white mt-4 flex p-3 rounded-lg'>
                        <img src={book.imageUrls[0]} alt={book.bookDescription} className='my-auto object-contain' style={{ height: '180px', width: "120px" }} />
                        <div className='mt-2 ml-4'>
                            <div className='text-base font-medium mb-2'>{book.bookDescription}</div>
                            <div className='text-sm text-gray-600'><b>Subject(s):</b> {book.subject}</div>
                            <div className='text-sm text-gray-600'><b>Author:</b> {book.author.join(', ')}</div>
                            <div className='flex gap-3 border-2 border-yellow-400 rounded-full p-2 mt-4 w-28 items-center justify-center'>
                                <img src={deletesvg} alt="Decrease quantity" className="cursor-pointer" onClick={handledelete} />
                                <div>{quantity}</div>
                                <img src={add} alt="Increase quantity" className="cursor-pointer" onClick={handleadd} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- Order Summary (Right side on Desktop) --- */}
                <div className='w-full md:w-[30%] bg-white p-4 border-2 rounded-lg h-max md:sticky top-4'>
                    <button className='bg-yellow-400 rounded-full text-base font-semibold w-full py-3 mb-4 hover:bg-yellow-500 transition-colors' onClick={() => {
                        if (!orderAddress) {
                            toast.error("Select an address.", {duration: 5000});
                            return;
                        }
                        navigate(`/checkout/${book.bookId}/?type=${purchaseType}`);
                    }}>Proceed</button>
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

export default Paymentcheckout;

