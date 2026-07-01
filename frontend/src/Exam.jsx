import React from 'react'
import './App.css'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import logo from './assets/logo_color2.png'
import down from './assets/down_arrow.svg'
import profile from './assets/account_circle_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.png'
import cart from './assets/shopping_cart.png'

// Custom hook to get window size
const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
        }, []);
        return windowSize;
};

const JEE = () => {

    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const { width } = useWindowSize(); // Get window width

    const { userId, isLoggedIn, setItemToAddAfterLogin, logout, name } = useAuth();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const subject = searchParams.get('subject')
    const exam = searchParams.get('exam')

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true); // Set loading to true at the start of fetch
            try {
                const response = await axios.get(`/api/books/exam/${exam}/${subject}`);
                setBooks(response.data);
            } catch (err) {
                setError('Failed to fetch books. Please make sure the server is running.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [subject, exam]);

    if (loading) {
        return <div className="text-center mt-10">Loading books...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    const handleCart = async (bookId) => {
        if (!isLoggedIn) {
            setItemToAddAfterLogin(bookId)
            await navigate('/login', { state: { from: location } })
        }
        else {
            const adding = await axios.post(`/api/cart/add/${bookId}`, { userId });
            toast.success(adding.data.message)
        }
    };

    return (
        <div>            
            <div className='p-4'>
                {books.map((book) => {
                    const isMobile = width < 640; // Tailwind's `sm` breakpoint

                    // --- Perform your calculations here, before the return ---
                    const newDiscountPercent = Math.round(((book.newPrice - book.newPriceDiscount) / book.newPrice) * 100);
                    const preOwnedDiscountPercent = Math.round(((book.preOwnedPrice - book.preOwnedPriceDiscount) / book.preOwnedPrice) * 100);

                    if (isMobile) {
                        // --- MOBILE LAYOUT (HORIZONTAL) ---
                        return (
                            <div key={book.bookId} className="card border-b border-gray-200 flex flex-row p-3 gap-4 mb-4">
                                <div className='w-1/3 flex-shrink-0 flex items-center justify-center'>
                                    <img src={book.imageUrls[0]} alt={book.bookDescription} className='object-contain h-36 cursor-pointer' onClick={() => navigate(`/book/${book.bookId}`)} />
                                </div>
                                <div className="w-2/3 flex flex-col">
                                    <div className="flex-grow">
                                        <div className='text-sm font-medium text-gray-800 overflow-hidden line-clamp-3 hover:text-blue-600 cursor-pointer' onClick={() => navigate(`/book/${book.bookId}`)}>{book.bookDescription}</div>
                                        <div className='my-1 text-xs text-gray-600'>by {book.author.join(', ')}</div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-2 text-center'>
                                        <button className='border border-gray-300 p-1 rounded-md hover:border-gray-500' onClick={() => navigate(`/book/${book.bookId}?type=new`)}>
                                            <div className='text-xs font-semibold'>New</div>
                                            <div><span className='text-base font-bold'>₹{book.newPriceDiscount}</span><span className='ml-1 line-through text-xs text-gray-500'>₹{book.newPrice}</span></div>
                                        </button>
                                        <button className='border border-gray-300 p-1 rounded-md hover:border-gray-500' onClick={() => navigate(`/book/${book.bookId}?type=preowned`)}>
                                            <div className='text-xs font-semibold'>Pre-Owned</div>
                                            <div><span className='text-base font-bold'>₹{book.preOwnedPriceDiscount}</span><span className='ml-1 line-through text-xs text-gray-500'>₹{book.preOwnedPrice}</span></div>
                                        </button>
                                    </div>
                                    <button className='bg-yellow-400 w-full rounded-md py-2 font-semibold hover:bg-yellow-500 text-xs mt-1' onClick={() => handleCart(book.bookId)}>
                                        Add to cart
                                    </button>
                                </div>
                            </div>
                        )
                    } else {
                        // --- DESKTOP LAYOUT (OPTIMIZED VERTICAL) ---
                        return (
                            <div key={book.bookId} className=' w-full px-[5px] mb-0.5'>
                                <div className="card border border-gray-200 rounded-lg box-border flex p-4 gap-[16px]">
                                    <img src={book.imageUrls[0]} alt={book.bookDescription} className='my-auto cursor-pointer object-contain' style={{ height: '240px', width: "180px" }} onClick={() => navigate(`/book/${book.bookId}`)} />
                                    <div className='flex flex-col flex-grow'>
                                        <div className='text-xl text-wrap overflow-hidden line-clamp-2 cursor-pointer hover:text-blue-600' onClick={() => navigate(`/book/${book.bookId}`)}>{book.bookDescription}</div>
                                        <div className='text-sm text-gray-600 mt-1'>by {book.author.join(', ')}</div>
                                        <div className='mt-4 flex-grow'>
                                            <span className='font-semibold'>Subject:</span> {book.subject} | <span className='font-semibold'>Exam:</span> {exam} | <span className='font-semibold'>Class:</span> {book.class.join(', ')}
                                        </div>
                                        <div className='items-center gap-6'>
                                            <div>
                                                <button className='border-[1px] border-black px-[5px] rounded-md mr-2' onClick={() => { navigate(`/book/${book.bookId}`) }}>
                                                    <div className='border-b-[1px] border-b-[black]'>New</div>
                                                    <div>
                                                        {/* Note: Your schema has 'newPriceDiscount', which seems to be the final price. I've updated the display to reflect that. */}
                                                        <div className='inline-block text-[30px] mr-2 font-semibold'>₹{book.newPriceDiscount}</div>
                                                        <div className='inline-block font-normal text-gray-500'>MRP: </div>
                                                        <div className='inline-block mr-2 line-through font-normal text-gray-500'>₹{book.newPrice}</div>
                                                        {/* Use the calculated variable here */}
                                                        <div className='inline-block'>({newDiscountPercent}% off)</div>
                                                    </div>
                                                </button>
                                                <button className='border-[1px] border-black px-[5px] rounded-md' onClick={() => { navigate(`/book/${book.bookId}`) }}>
                                                    <div className='border-b-[1px] border-b-[black]'>Pre-Owned</div>
                                                    <div>
                                                        <div className='inline-block text-[30px] mr-2 font-semibold'>₹{book.preOwnedPriceDiscount}</div>
                                                        <div className='inline-block font-normal text-gray-500'>MRP: </div>
                                                        <div className='inline-block mr-2 line-through font-normal text-gray-500'>₹{book.preOwnedPrice}</div>
                                                        {/* Use the calculated variable here */}
                                                        <div className='inline-block'>({preOwnedDiscountPercent}% off)</div>
                                                    </div>
                                                </button>
                                            </div>
                                            <button className='bg-yellow-400 rounded-md w-[200px] py-[5px] font-semibold hover:bg-yellow-500 mt-3' onClick={() => handleCart(book.bookId)}>
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    )
}

export default JEE;
