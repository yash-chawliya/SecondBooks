import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { useAuth } from './AuthContext';
import logo from './assets/logo_color2.png';
import down from './assets/down_arrow.svg';
import profile from './assets/account_circle_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24.png';
import cart from './assets/shopping_cart.png';

// --- Icon Components ---
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-500 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z" />
    </svg>
);
const HamburgerIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
    </svg>
);
const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
);

// --- Reusable Category List Component ---
const CategoryMenu = ({ onLinkClick }) => {
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
        if (onLinkClick) onLinkClick(); // Close mobile menu on click
    };

    return (
        <>
            <ul className="text-white md:text-inherit">
                <li className='font-bold text-lg md:text-2xl'>JEE</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=jee&subject=physics')}>Physics</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=jee&subject=chemistry')}>Chemistry</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=jee&subject=mathematics')}>Mathematics</li>
            </ul>
            <ul className="text-white md:text-inherit">
                <li className='font-bold text-lg md:text-2xl'>NEET</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=neet&subject=physics')}>Physics</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=neet&subject=chemistry')}>Chemistry</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=neet&subject=botany')}>Botany</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=neet&subject=zoology')}>Zoology</li>
            </ul>
            <ul className="text-white md:text-inherit">
                <li className='font-bold text-lg md:text-2xl'>Class 10</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE10&subject=science')}>Science</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE10&subject=mathematics')}>Mathematics</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE10&subject=english')}>English</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE10&subject=socialscience')}>Social science</li>
            </ul>
            <ul className="text-white md:text-inherit">
                <li className='font-bold text-lg md:text-2xl'>Class 11</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE11&subject=physics')}>Physics</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE11&subject=chemistry')}>Chemistry</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE11&subject=biology')}>Biology</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE11&subject=mathematics')}>Mathematics</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE11&subject=english')}>English</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE11&subject=PhysicalEducation')}>Physical education</li>
            </ul>
            <ul className="text-white md:text-inherit">
                <li className='font-bold text-lg md:text-2xl'>Class 12</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE12&subject=physics')}>Physics</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE12&subject=chemistry')}>Chemistry</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE12&subject=biology')}>Biology</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE12&subject=mathematics')}>Mathematics</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE12&subject=english')}>English</li>
                <li className='hover:underline cursor-pointer' onClick={() => handleNavigate('/exam?exam=CBSE12&subject=PhysicalEducation')}>Physical education</li>
            </ul>
        </>
    );
};


const Navbar2 = () => {
    const { isLoggedIn, logout, name } = useAuth();
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const sendSearchRequest = async (searchQuery) => {
        if (searchQuery.trim() === '') {
            setSuggestions([]);
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/books/search?q=${searchQuery}`);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Search request failed:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedSendSearch = useCallback(debounce(sendSearchRequest, 300), []);

    const handleInputChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        debouncedSendSearch(newQuery);
    };

    const handleSuggestionClick = (bookId) => {
        setQuery('');
        setSuggestions([]);
        navigate(`/book/${bookId}`);
    };

    const handleMobileLinkClick = (path) => {
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    return (
        <div className='flex items-center justify-between md:justify-evenly h-20 border-b px-4 bg-white z-20'>
            <img src={logo} alt="SecondBooks Logo" className='h-16 w-16 cursor-pointer' onClick={() => navigate('/')} />

            {/* --- Desktop Links --- */}
            <div className="hidden md:flex items-center gap-4">
                <div className="relative group">
                    <div className='flex items-center justify-center gap-2 border py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white cursor-pointer'>
                        Shop by Category <img src={down} alt="" className='group-hover:invert w-4 h-4' />
                    </div>
                    <div className="absolute top-full left-0 hidden group-hover:flex bg-blue-900 shadow-lg z-10 gap-10 p-4 text-white rounded-b-md">
                        <CategoryMenu />
                    </div>
                </div>
            </div>

            {/* --- Live Search Bar (Visible on all screen sizes) --- */}
            <div className="relative flex-grow max-w-lg mx-4">
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full bg-gray-100 shadow-sm">
                    <SearchIcon />
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Search..."
                        className="outline-none bg-transparent w-full text-gray-700 placeholder-gray-400"
                    />
                </div>
                {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <ul>
                            {suggestions.slice(0, 5).map((book) => (
                                <li key={book.bookId} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer border-b" onClick={() => handleSuggestionClick(book.bookId)}>
                                    <img src={book.imageUrls && book.imageUrls.length > 0 ? book.imageUrls[0] : '/images/placeholder.webp'} alt={book.bookDescription} className="w-10 h-12 object-contain flex-shrink-0 mr-3" />
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-gray-800 truncate">{book.bookDescription}</p>
                                        <p className="text-xs text-gray-500">by {book.author.join(', ')}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* --- Desktop User/Cart Links --- */}
            <div className="hidden md:flex items-center gap-4">
                {isLoggedIn ? (
                    <div className='relative group flex items-center justify-center gap-1 border py-2 px-4 rounded-md hover:bg-blue-500 hover:text-white cursor-pointer'>
                        <div>Hey <b>{name}</b></div>
                        <div className="absolute top-full left-0 hidden group-hover:flex bg-[#3761bb] shadow-lg z-10 gap-[40px] text-white  whitespace-nowrap flex-nowrap">
                            <ul className="flex flex-col text-black border border-black">
                                <li className='hover:underline hover:bg-gray-400 w-full cursor-pointer px-[20px] py-[10px]' onClick={() => { navigate('/orders') }}>Your Orders</li>
                                <li className='hover:underline hover:bg-gray-400 w-full cursor-pointer px-[20px] py-[10px]' onClick={() => { navigate('/account') }}>Your Account</li>
                                <li className='hover:underline cursor-pointer px-[20px] py-[10px]' onClick={logout}>Logout</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className='flex items-center justify-center gap-2 border py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white group cursor-pointer' onClick={() => navigate('/login')}>
                        <img src={profile} alt="" className='group-hover:invert' />
                        Login
                    </div>
                )}
                <div className='flex items-center justify-center gap-2 cursor-pointer' onClick={() => navigate('/cart')}>
                    <img src={cart} alt="" />
                    Cart
                </div>
            </div>

            {/* --- Hamburger Icon (Mobile Only) --- */}
            <div className="md:hidden flex items-center">
                <button onClick={() => setIsMobileMenuOpen(true)}>
                    <HamburgerIcon />
                </button>
            </div>

            {/* --- Mobile Menu Drawer --- */}
            <div className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-blue-900 text-white p-6 transform transition-transform z-30 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold">Menu</h2>
                    <button onClick={() => setIsMobileMenuOpen(false)}>
                        <CloseIcon />
                    </button>
                </div>
                <div className="space-y-6">
                    {isLoggedIn ? (
                        <div>
                            <div className=" text-[26px] mb-2">Hey <b>{name}</b></div>
                            <ul className="space-y-2">
                                <li className="hover:underline cursor-pointer" onClick={() => handleMobileLinkClick('/orders')}>Your Orders</li>
                                <li className="hover:underline cursor-pointer" onClick={() => handleMobileLinkClick('/cart')}>Cart</li>
                                <li className="hover:underline cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); logout(); navigate('/'); }}>Logout</li>
                            </ul>
                        </div>
                    ) : (
                        <div className="hover:underline cursor-pointer text-lg" onClick={() => handleMobileLinkClick('/login')}>
                            Login / Signin
                        </div>
                    )}
                    <div className="border-t border-blue-700 pt-6">
                        <h3 className="text-[20px] font-semibold mb-4">Shop by Category</h3>
                        <div className="space-y-4">
                            <CategoryMenu onLinkClick={() => setIsMobileMenuOpen(false)} />
                        </div>
                    </div>
                </div>
            </div>
            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
        </div>
    )
}

export default Navbar2;
