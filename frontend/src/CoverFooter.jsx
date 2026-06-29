import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import toast, { Toaster } from 'react-hot-toast';

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


const CoverFooter = () => {
    const [featuredBooks, setFeaturedBooks] = useState([])
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { width } = useWindowSize(); // Get window width

    const { userId, isLoggedIn, setItemToAddAfterLogin } = useAuth();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await axios.get('/api/books');
                if (Array.isArray(response.data)) {
                    setFeaturedBooks(response.data);
                } else {
                    console.error("API did not return an array for featured books:", response.data);
                    setFeaturedBooks([]);
                }
            }
            catch (err) {
                setError("Unable to fetch featured books.")
                console.error(err)
            }
            setLoading(false)
        }

        fetchFeatured();
    }, [])

    if (loading) {
        return <div className="text-center mt-10">Loading books...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    const handleCart = async (bookId) => {
        if (!isLoggedIn) {
            navigate('/login')
        }
        else {
            const adding = await axios.post(`/api/cart/add/${bookId}`, { userId });
            toast.success(adding.data.message)
        }
    };

    return (
        <div>
            <div className='p-4 md:p-5'>
                <Toaster position="top-right" />
                <div className='text-center font-bold text-3xl mb-4'>TRENDING</div>
                {/* On mobile, we use a flex column. On desktop, a grid. */}
                <div className='flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {
                        featuredBooks.map((book) => {
                            const isMobile = width < 768; // Tailwind's `md` breakpoint is a good switch point

                            if (isMobile) {
                                // --- MOBILE LAYOUT (HORIZONTAL) ---
                                return (
                                    <div key={book.bookId} className="card border border-gray-200 rounded-lg flex flex-row p-3 shadow-sm gap-4">
                                        {/* Image Section */}
                                        <div className='w-1/3 flex-shrink-0 flex items-center justify-center'>
                                            <img
                                                src={book.imageUrls && book.imageUrls.length > 0 ? book.imageUrls[0] : '/images/placeholder.jpg'}
                                                alt={book.bookDescription}
                                                className='object-contain h-32 cursor-pointer'
                                                onClick={() => navigate(`/book/${book.bookId}`)}
                                            />
                                        </div>
                                        {/* Details Section */}
                                        <div className="w-2/3 flex flex-col">
                                            <div className="flex-grow">
                                                <div className='text-sm font-medium text-gray-800 overflow-hidden line-clamp-3 hover:text-blue-600 cursor-pointer' onClick={() => navigate(`/book/${book.bookId}`)}>
                                                    {book.bookDescription}
                                                </div>
                                                <div className='my-1 text-xs text-gray-600 font-semibold'>by {book.author.join(', ')}</div>
                                            </div>
                                            <div className='space-y-2 pt-2'>
                                                <div className='grid grid-cols-2 gap-2 text-center'>
                                                    <button className='border border-gray-300 p-1 rounded-md hover:border-gray-500' onClick={() => navigate(`/book/${book.bookId}?type=new`)}>
                                                        <div className='text-xs font-semibold border-b border-b-gray-500'>New</div>
                                                        <div><span className='text-base font-bold'>₹{book.newPriceDiscount}</span><span className='ml-1 line-through text-xs text-gray-500'>₹{book.newPrice}</span></div>
                                                    </button>
                                                    <button className='border border-gray-300 p-1 rounded-md hover:border-gray-500' onClick={() => navigate(`/book/${book.bookId}?type=preowned`)}>
                                                        <div className='text-xs font-semibold border-b border-b-gray-500'>Pre-Owned</div>
                                                        <div><span className='text-base font-bold'>₹{book.preOwnedPriceDiscount}</span><span className='ml-1 line-through text-xs text-gray-500'>₹{book.preOwnedPrice}</span></div>
                                                    </button>
                                                </div>
                                                <button className='bg-yellow-400 w-full rounded-md py-2 font-semibold hover:bg-yellow-500 text-xs' onClick={() => handleCart(book.bookId)}>
                                                    Add to cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            } else {
                                // --- DESKTOP LAYOUT (VERTICAL) ---
                                return (
                                    <div key={book.bookId} className="card border border-gray-200 rounded-lg flex flex-col p-3 shadow-sm hover:shadow-lg transition-shadow duration-300" onClick={() => navigate(`/book/${book.bookId}`)}>
                                        <div className='items-center text-center flex justify-center h-48'>
                                            <img
                                                src={book.imageUrls && book.imageUrls.length > 0 ? book.imageUrls[0] : '/images/placeholder.jpg'}
                                                alt={book.bookDescription}
                                                className='object-contain max-h-full max-w-full cursor-pointer'
                                                onClick={() => navigate(`/book/${book.bookId}`)}
                                            />
                                        </div>
                                        <div className="flex flex-col flex-grow mt-2">
                                            <div className="flex-grow">
                                                <div className='text-sm font-medium text-gray-800 overflow-hidden line-clamp-3 hover:text-blue-600 cursor-pointer' onClick={() => navigate(`/book/${book.bookId}`)}>
                                                    {book.bookDescription}
                                                </div>
                                                <div className='my-2 text-xs text-gray-600 font-semibold'>by {book.author.join(', ')}</div>
                                            </div>
                                            <div className='space-y-2 pt-2'>
                                                <div className='grid grid-cols-2 gap-2 text-center'>
                                                    <button className='border border-gray-300 p-1 rounded-md hover:border-gray-500' onClick={() => navigate(`/book/${book.bookId}?type=new`)}>
                                                        <div className='text-xs font-semibold border-b border-b-gray-500'>New</div>
                                                        <div><span className='text-base font-bold'>₹{book.newPriceDiscount}</span><span className='ml-1 line-through text-xs text-gray-500'>₹{book.newPrice}</span></div>
                                                    </button>
                                                    <button className='border border-gray-300 p-1 rounded-md hover:border-gray-500' onClick={() => navigate(`/book/${book.bookId}?type=preowned`)}>
                                                        <div className='text-xs font-semibold border-b border-b-gray-500'>Pre-Owned</div>
                                                        <div><span className='text-base font-bold'>₹{book.preOwnedPriceDiscount}</span><span className='ml-1 line-through text-xs text-gray-500'>₹{book.preOwnedPrice}</span></div>
                                                    </button>
                                                </div>
                                                <button className='bg-yellow-400 w-full rounded-md py-2 font-semibold hover:bg-yellow-500 text-sm' onClick={() => { setItemToAddAfterLogin(book.bookId); handleCart(book.bookId); }}>
                                                    Add to cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
            <div className='flex justify-around mt-3 bg-blue-950 text-white p-0.5 text-sm'>
                <span className='hover:text-blue-200 hover:cursor-pointer hover:underline' onClick={() => navigate('/Contactus')}>Contact Us</span>
                <div className='hover:text-blue-200 hover:cursor-pointer hover:underline' onClick={() => navigate('/PrivacyPolicy')}>Privacy policy</div>
                <div className='hover:text-blue-200 hover:cursor-pointer hover:underline' onClick={() => navigate('/TermsAndConditions')}>Terms and Conditions</div>
                <div className='hover:text-blue-200 hover:cursor-pointer hover:underline' onClick={() => navigate('/CancellationPolicy')}>Cancellation and Refunds</div>
                <div className='hover:text-blue-200 hover:cursor-pointer hover:underline' onClick={() => navigate('/ShippingPolicy')}>Shipping</div>
            </div>
        </div>
    )
}

export default CoverFooter;

