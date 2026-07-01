import React from 'react';
import delivery from './assets/delivery.svg';
import replacement from './assets/replacement2.png';
import payment from './assets/payment.svg';
import secure from './assets/secure_transaction.svg';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { addDays, format } from 'date-fns'; // For easy date calculation
import debounce from 'lodash.debounce'; // To prevent excessive API calls

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


const ProductView = () => {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState('new');
    const location = useLocation();
    const { width } = useWindowSize();
    
    const [selectedImage, setSelectedImage] = useState(null);

    const { setItemToAddAfterLogin, isLoggedIn, userId } = useAuth();

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`/api/books/${bookId}`);
                setBook(response.data);
                
                if (response.data.imageUrls && response.data.imageUrls.length > 0) {
                    setSelectedImage(response.data.imageUrls[0]);
                }

            } catch (error) {
                console.error("Failed to fetch book details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails()
    }, [bookId]);

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (!book) return <div className="text-center p-10">Book not found.</div>;

    const handleCart = async (bookId) => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: location } });
            return;
        }
        else {
            const adding = await axios.post(`/api/cart/add/${bookId}`, { userId });
            alert(adding.data.message)
        }
    };

    const detailsFromDB = book.details;
    const newDiscountPercent = Math.round(((book.newPrice - book.newPriceDiscount) / book.newPrice) * 100);
    const preOwnedDiscountPercent = Math.round(((book.preOwnedPrice - book.preOwnedPriceDiscount) / book.preOwnedPrice) * 100);

    const isMobile = width < 768;

    // --- NEW: Delivery Estimator Component ---
    const DeliveryEstimator = () => {
        const [pincode, setPincode] = useState('');
        const [estimatedDate, setEstimatedDate] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState('');

        const getDeliveryEstimate = async (code) => {
            if (code.length !== 6) {
                setError('');
                setEstimatedDate('');
                return;
            }
            
            setIsLoading(true);
            setError('');

            try {
                const response = await axios.post('/api/delivery/estimate', {
                    destination_pin: code,
                });
                const tat = response.data.tat; // Turn Around Time in days
                const tomorrow = addDays(new Date(), 1);
                const deliveryDate = addDays(tomorrow, tat);
                setEstimatedDate(format(deliveryDate, "eeee, dd MMMM")); // e.g., "Monday, 09 September"
            } catch (err) {
                setError('Delivery not available for this pincode.');
                setEstimatedDate('');
            } finally {
                setIsLoading(false);
            }
        };
        
        const debouncedGetEstimate = useCallback(debounce(getDeliveryEstimate, 600), []);

        const handleChange = (e) => {
            const value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
            setPincode(value);
            debouncedGetEstimate(value);
        };

        return (
            <div className="mt-4">
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Check Delivery Date</label>
                <input
                    type="text"
                    id="pincode"
                    value={pincode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    maxLength="6"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {isLoading && <div className="text-sm text-gray-500 mt-2">Checking...</div>}
                {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
                {estimatedDate && (
                    <div className="text-sm text-green-600 font-semibold mt-2">
                        Delivered by: {estimatedDate}
                    </div>
                )}
            </div>
        );
    };

    const PurchaseBox = () => (
        <div className='w-full p-4 border rounded-lg bg-white'>
            <div className='pb-2'>
                <div className={`mb-2 gap-2 flex items-center w-full text-start p-2 border-2 rounded-md cursor-pointer ${type === 'new' ? 'border-yellow-500 bg-yellow-100' : 'border-gray-300'}`} onClick={() => setType("new")}>
                    <input type="radio" name="type" id="new" readOnly checked={type === 'new'} className="form-radio h-5 w-5 text-yellow-600" />
                    <label htmlFor="new" className="text-xl cursor-pointer">New: ₹{book.newPriceDiscount}</label>
                </div>
                <div className={`mb-2 gap-2 flex items-center w-full text-start p-2 border-2 rounded-md cursor-pointer ${type === 'preowned' ? 'border-yellow-500 bg-yellow-100' : 'border-gray-300'}`} onClick={() => setType("preowned")}>
                    <input type="radio" name="type" id="preowned" readOnly checked={type === 'preowned'} className="form-radio h-5 w-5 text-yellow-600" />
                    <label htmlFor="preowned" className="text-xl cursor-pointer">Pre-Owned: ₹{book.preOwnedPriceDiscount}</label>
                </div>
            </div>

            {/* General pre-owned note */}
            {type === 'preowned' && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-800">
                    <strong>Please Note:</strong> The condition and edition of pre-owned books may differ slightly from the pictures shown. We strive to provide the latest available edition.
                </div>
            )}

            {/* --- NEW: PYQ specific note --- */}
            {type === 'preowned' && book.bookId.includes('PYQ') && (
                 <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md text-xs text-orange-800">
                    <strong>PYQ Advisory:</strong> Pre-owned PYQ books may not include the most recent year's papers. It is advised to purchase new for the latest content.
                </div>
            )}
            
            <div className="mt-2">
                <span className='text-red-600 font-light text-2xl mr-2'>-{type === 'new' ? newDiscountPercent : preOwnedDiscountPercent}%</span>
                <span className='text-4xl'>₹{type === 'new' ? book.newPriceDiscount : book.preOwnedPriceDiscount}</span>
            </div>
            <div className="text-sm">
                <span className='text-gray-500'>MRP:</span>
                <span className='line-through text-gray-500'>₹{type === 'new' ? book.newPrice : book.preOwnedPrice}</span>
            </div>
            <div className="text-sm mt-2">Inclusive of all taxes</div>
            <div className="text-sm mt-4 font-bold">FREE delivery.</div>
            
            <DeliveryEstimator />

            <div className="mt-4">
                <button className='w-full rounded-full bg-yellow-400 h-11 text-lg' onClick={() => {
                    setItemToAddAfterLogin(book.bookId)
                    handleCart(book.bookId)
                }}>Add to Cart</button>
            </div>
            <div className="mt-2">
                <button className='w-full rounded-full bg-orange-500 text-white h-11 text-lg' onClick={() => { navigate(`/book/${book.bookId}/payment?type=${type}`) }}>Buy Now</button>
            </div>
        </div>
    );

    const ImageGallery = () => (
        <div className="w-full flex flex-col items-center">
            <div className="border rounded-lg p-2 mb-2">
                <img
                    src={selectedImage || '/images/placeholder.webp'}
                    alt={book.bookDescription}
                    className='object-contain'
                    style={{ height: '350px', width: "250px" }}
                    fetchpriority="high"
                />
            </div>
            {/* --- FIX: Adjusted thumbnail size and container width --- */}
            <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
                {book.imageUrls && book.imageUrls.map((url, index) => (
                    <div
                        key={index}
                        className={`p-1 border-2 rounded cursor-pointer ${selectedImage === url ? 'border-yellow-500' : 'border-transparent'}`}
                        onClick={() => setSelectedImage(url)}
                    >
                        <img
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            className="object-contain w-14 h-14"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <div className="p-2 flex flex-col gap-4">
                <ImageGallery />
                <div className='w-full'>
                    <div className='text-xl font-normal mb-2'>{book.bookDescription}</div>
                    <div className='text-base'><b>Subject(s):</b> {book.subject}</div>
                    <div className='text-base'><b>Exam:</b> {book.exam.startsWith('CBSE') ? 'CBSE' : book.exam}</div>
                </div>
                <PurchaseBox />
                <div className='w-full'>
                     <div className='flex justify-around mt-4 text-sm border-y py-4'>
                         <div className='text-center'><img src={delivery} alt="Free Delivery" className='h-10 mx-auto' /><div>Free delivery</div></div>
                         <div className='text-center'><img src={replacement} alt="3 Days Exchange" className='h-10 mx-auto' /><div>3 days exchange</div></div>
                         <div className='text-center'><img src={payment} alt="Pay on Delivery" className='h-10 mx-auto' /><div>Pay on delivery</div></div>
                         <div className='text-center'><img src={secure} alt="Secure Transaction" className='h-10 mx-auto' /><div>Secure transaction</div></div>
                    </div>
                    <div className="prose max-w-none mt-4">
                        <div dangerouslySetInnerHTML={{ __html: detailsFromDB }} className='pt-4 text-sm' />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='p-2 md:p-5 flex flex-col md:flex-row items-start gap-4'>
            <div className="md:w-auto md:flex-shrink-0 md:sticky top-5">
                <ImageGallery />
            </div>

            <div className='w-full md:w-1/2'>
                <div className='pb-2'>
                    <div className='text-2xl font-normal mb-2'>{book.bookDescription}</div>
                    <div className='text-lg'><b>Subject(s):</b> {book.subject}</div>
                    <div className='text-lg'><b>Exam:</b> {book.exam.startsWith('CBSE') ? 'CBSE' : book.exam}</div>
                    <div className='text-lg'><b>Author:</b> {book.author.join(', ')}</div>
                    <div className='text-lg'><b>Publisher:</b> {book.publisher}</div>
                </div>
                <div className='flex justify-around mt-4 text-sm border-y py-4'>
                    <div className='text-center'><img src={delivery} alt="Free Delivery" className='h-10 mx-auto' /><div>Free delivery</div></div>
                    <div className='text-center'><img src={replacement} alt="3 Days Exchange" className='h-10 mx-auto' /><div>3 days exchange</div></div>
                    <div className='text-center'><img src={payment} alt="Pay on Delivery" className='h-10 mx-auto' /><div>Pay on delivery</div></div>
                    <div className='text-center'><img src={secure} alt="Secure Transaction" className='h-10 mx-auto' /><div>Secure transaction</div></div>
                </div>
                <div className="prose max-w-none mt-4">
                    <div dangerouslySetInnerHTML={{ __html: detailsFromDB }} className='pt-4 text-sm' />
                </div>
            </div>

            <div className='w-full md:w-1/4 md:sticky top-5'>
                <PurchaseBox />
            </div >
        </div >
    )
}

export default ProductView;

