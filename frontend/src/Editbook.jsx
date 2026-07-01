import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

// Re-using the icons from your Addbook component
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);
const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);


function EditBook() {
    const initialBookState = {
        bookId: '',
        bookDescription: '',
        imageUrls: [''],
        subject: '',
        tags: [''],
        author: [''], // Correctly handle multiple authors
        publisher: '',
        class: [''],
        exam: '',
        newPrice: '',
        newPriceDiscount: '',
        preOwnedPrice: '',
        preOwnedPriceDiscount: '',
        details: '',
        language: 'English',
    };

    const [searchId, setSearchId] = useState('');
    const [bookData, setBookData] = useState(initialBookState);
    const [isBookLoaded, setIsBookLoaded] = useState(false);

    // --- Data Fetching ---
    const handleLoadBook = async () => {
        if (!searchId) {
            toast.error('Please enter a Book ID to load.');
            return;
        }
        const loadingToast = toast.loading('Loading book data...');
        try {
            const response = await axios.get(`/api/books/${searchId}`);
            const fetchedData = {
                ...response.data,
                imageUrls: response.data.imageUrls && response.data.imageUrls.length > 0 ? response.data.imageUrls : [''],
                tags: response.data.tags && response.data.tags.length > 0 ? response.data.tags : [''],
                class: response.data.class && response.data.class.length > 0 ? response.data.class : [''],
                author: response.data.author && response.data.author.length > 0 ? response.data.author : [''], // Handle author array
            };
            delete fetchedData.imageUrl; // Clean up old data if it exists
            setBookData(fetchedData);
            setIsBookLoaded(true);
            toast.success(`Successfully loaded book: ${searchId}`, { id: loadingToast });
        } catch (error) {
            setIsBookLoaded(false);
            toast.error('Failed to load book. Please check the ID.', { id: loadingToast });
            console.error(error);
        }
    };

    // --- Generic Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    };

     // --- Reusable Array Handlers ---
    const handleArrayChange = (field, index, value) => {
        const newArray = [...bookData[field]];
        newArray[index] = value;
        setBookData({...bookData, [field]: newArray});
    }
    const addArrayField = (field, object = '') => {
        setBookData({...bookData, [field]: [...bookData[field], object]});
    }
    const removeArrayField = (field, index) => {
        if (bookData[field].length > 1) {
            setBookData({...bookData, [field]: bookData[field].filter((_, i) => i !== index)});
        }
    }

    // --- Form Submission (Update) ---
    const handleUpdate = async (e) => {
        e.preventDefault();

        const payload = {
            ...bookData,
            author: bookData.author.filter(auth => auth.trim() !== ''),
            imageUrls: bookData.imageUrls.filter(url => url.trim() !== ''),
            tags: bookData.tags.filter(tag => tag.trim() !== ''),
            class: bookData.class.filter(c => c.toString().trim() !== '').map(c => Number(c)),
        };

        if (payload.class.some(isNaN)) {
            toast.error('Class must be a number.');
            return;
        }

        const promise = axios.put(`/api/books/${bookData.bookId}`, payload);

        toast.promise(promise, {
            loading: 'Updating book...',
            success: 'Book updated successfully!',
            error: (err) => err.response?.data?.message || 'Update failed.'
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            <Toaster position="top-right" />
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Edit Book Details</h1>

                <div className="mb-6 p-4 border rounded-md bg-gray-50">
                    <label htmlFor="searchId" className="block text-sm font-medium text-gray-700 mb-1">Enter Book ID to Edit</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            id="searchId"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            placeholder="e.g., JEEPHY6810"
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={handleLoadBook}
                            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                            Load Book
                        </button>
                    </div>
                </div>

                {isBookLoaded && (
                    <form onSubmit={handleUpdate} className="space-y-6">
                        {/* --- Row 1: Book ID, Subject, Exam --- */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 mb-1">Book ID</label>
                                <input type="text" name="bookId" id="bookId" value={bookData.bookId} readOnly className="w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input type="text" name="subject" id="subject" value={bookData.subject} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="exam" className="block text-sm font-medium text-gray-700 mb-1">Exam Category</label>
                                <select name="exam" id="exam" value={bookData.exam} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                                    <option value="">Select Exam</option>
                                    <option value="JEE">JEE</option>
                                    <option value="NEET">NEET</option>
                                    <option value="CAT">CAT</option>
                                    <option value="UPSC">UPSC</option>
                                    <option value="CBSE10">CBSE10</option>
                                    <option value="CBSE11">CBSE11</option>
                                    <option value="CBSE12">CBSE12</option>
                                    <option value="ICSE">ICSE</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                        </div>

                        {/* --- Row 2: Description --- */}
                        <div>
                            <label htmlFor="bookDescription" className="block text-sm font-medium text-gray-700 mb-1">Book Description</label>
                            <textarea name="bookDescription" id="bookDescription" rows="3" value={bookData.bookDescription} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>
                        
                        {/* --- Row for Image URLs --- */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs</label>
                            {bookData.imageUrls.map((url, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2">
                                    <input type="text" value={url} onChange={(e) => handleArrayChange('imageUrls', index, e.target.value)} placeholder="/images/cover.png" className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                    <button type="button" onClick={() => removeArrayField('imageUrls', index)} className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-red-300" disabled={bookData.imageUrls.length === 1}>
                                        <MinusIcon />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayField('imageUrls')} className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                <PlusIcon /> Add Image URL
                            </button>
                        </div>

                        {/* --- Authors Section --- */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Authors</label>
                            {bookData.author.map((author, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2">
                                    <input type="text" value={author} onChange={(e) => handleArrayChange('author', index, e.target.value)} placeholder="e.g., H.C. Verma" className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                    <button type="button" onClick={() => removeArrayField('author', index)} className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-red-300" disabled={bookData.author.length === 1}>
                                        <MinusIcon />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => addArrayField('author')} className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                <PlusIcon /> Add Author
                            </button>
                        </div>
                        
                        {/* --- Publisher and Language --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
                                <input type="text" name="publisher" id="publisher" value={bookData.publisher} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                <input type="text" name="language" id="language" value={bookData.language} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>

                        {/* --- Tags and Class --- */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                {bookData.tags.map((tag, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <input type="text" value={tag} onChange={(e) => handleArrayChange('tags', index, e.target.value)} className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                        <button type="button" onClick={() => removeArrayField('tags', index)} className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-red-300" disabled={bookData.tags.length === 1}><MinusIcon /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addArrayField('tags')} className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"><PlusIcon /> Add Tag</button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                {bookData.class.map((c, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <input type="number" value={c} onChange={(e) => handleArrayChange('class', index, e.target.value)} className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                                        <button type="button" onClick={() => removeArrayField('class', index)} className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-red-300" disabled={bookData.class.length === 1}><MinusIcon /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addArrayField('class')} className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"><PlusIcon /> Add Class</button>
                            </div>
                        </div>

                        {/* --- Pricing --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t pt-6">
                            <div>
                                <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700 mb-1">New Price (₹)</label>
                                <input type="number" name="newPrice" id="newPrice" value={bookData.newPrice} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="newPriceDiscount" className="block text-sm font-medium text-gray-700 mb-1">After discount new (₹)</label>
                                <input type="number" name="newPriceDiscount" id="newPriceDiscount" value={bookData.newPriceDiscount} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="preOwnedPrice" className="block text-sm font-medium text-gray-700 mb-1">Pre-Owned Price (₹)</label>
                                <input type="number" name="preOwnedPrice" id="preOwnedPrice" value={bookData.preOwnedPrice} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="preOwnedPriceDiscount" className="block text-sm font-medium text-gray-700 mb-1">After discount pre owned (₹)</label>
                                <input type="number" name="preOwnedPriceDiscount" id="preOwnedPriceDiscount" value={bookData.preOwnedPriceDiscount} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>

                        {/* --- Details --- */}
                        <div>
                            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                            <textarea name="details" id="details" rows="4" value={bookData.details} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                        </div>

                        <div className="flex items-center justify-between border-t pt-6">
                            <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default EditBook;

