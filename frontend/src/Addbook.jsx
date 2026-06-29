import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// Icon components
const PlusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg> );
const MinusIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" /></svg> );
const RefreshIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V4a1 1 0 011-1zm10 8a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 111.885-.666A5.002 5.002 0 0014.001 13H11a1 1 0 01-1-1z" clipRule="evenodd" /></svg> );

const generateBookId = (exam, subject) => {
  if (!exam || !subject || subject.length < 3) return '';
  const examPart = exam.toUpperCase().trim();
  const subjectPart = subject.substring(0, 3).toUpperCase().trim();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${examPart}${subjectPart}${randomPart}`;
};


function Addbook() {
  const initialBookState = {
    bookId: '',
    bookDescription: '',
    images: [{ prefix: '', url: '' }],
    subject: '',
    tags: [''],
    author: [''],
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

  const [bookData, setBookData] = useState(initialBookState);

  useEffect(() => {
    if (bookData.exam && bookData.subject) {
      const newBookId = generateBookId(bookData.exam, bookData.subject);
      setBookData(prevData => ({ ...prevData, bookId: newBookId }));
    }
  }, [bookData.exam, bookData.subject]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...bookData, [name]: value };
    if (name === 'newPrice') {
        const price = Number(value);
        if (!isNaN(price) && price > 0) {
            updatedData.newPriceDiscount = Math.round((price * 0.75) + 60);
            updatedData.preOwnedPrice = Math.round(price * 0.60);
            updatedData.preOwnedPriceDiscount = Math.round((price * 0.50) + 60);
        } else {
            updatedData.newPriceDiscount = '';
            updatedData.preOwnedPrice = '';
            updatedData.preOwnedPriceDiscount = '';
        }
    }
    setBookData(updatedData);
  };
  
  const handleRegenerateId = () => {
    const newBookId = generateBookId(bookData.exam, bookData.subject);
    setBookData(prevData => ({ ...prevData, bookId: newBookId }));
  };

  const handleArrayChange = (field, index, subField, value) => {
      const newArray = [...bookData[field]];
      if (subField) {
        newArray[index][subField] = value;
      } else {
        newArray[index] = value;
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bookData.bookId) {
        toast.error('Please ensure Exam and Subject are filled to generate a Book ID.');
        return;
    }

    const payload = {
      ...bookData,
      images: bookData.images
        .filter(img => img.prefix.trim() !== '' && img.url.trim() !== '')
        .map(img => ({ name: `${img.prefix}${bookData.bookId}`, url: img.url })),
      author: bookData.author.filter(auth => auth.trim() !== ''),
      tags: bookData.tags.filter(tag => tag.trim() !== ''),
      class: bookData.class.filter(c => c.toString().trim() !== '').map(c => Number(c)),
    };
    
    if (payload.class.some(isNaN)) {
        toast.error('Class must be a number.');
        return;
    }

    const promise = axios.post('/api/add/book', payload);

    toast.promise(promise, {
        loading: 'Submitting and processing images...',
        success: (response) => {
            setBookData(initialBookState);
            return response.data.message || 'Book added successfully!';
        },
        error: (error) => {
            return error.response?.data?.message || 'Submission failed. Please try again.';
        }
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Add New Book</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 mb-1">Book ID (Auto-Generated)</label>
              <div className="flex items-center gap-2">
                <input type="text" name="bookId" id="bookId" value={bookData.bookId} readOnly className="flex-grow px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm" />
                <button type="button" onClick={handleRegenerateId} className="p-2 text-white bg-gray-500 rounded-md hover:bg-gray-600 focus:outline-none" title="Regenerate Book ID">
                  <RefreshIcon />
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select name="subject" id="subject" value={bookData.subject} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" >
                <option value="">Select Subject</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Botany">Botany</option>
                <option value="Zoology">Zoology</option>
                <option value="Economics">Economics</option>
                <option value="Accountancy">Accountancy</option>
                <option value="Business studies">Business studies</option>
                <option value="English">English</option>
                <option value="PYQ">PYQ</option>
                <option value="Formula_sheets">Formula_sheets</option>
              </select>
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

          <div>
            <label htmlFor="bookDescription" className="block text-sm font-medium text-gray-700 mb-1">Book Description</label>
            <textarea name="bookDescription" id="bookDescription" rows="3" value={bookData.bookDescription} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
            {bookData.images.map((image, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-2 p-2 border rounded-md">
                 <input 
                    type="text" 
                    value={image.prefix} 
                    onChange={(e) => handleArrayChange('images', index, 'prefix', e.target.value)} 
                    placeholder="Image Prefix (e.g., a, b)" 
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                    required
                />
                <div className="flex items-center gap-2">
                    <input 
                        type="url" 
                        value={image.url} 
                        onChange={(e) => handleArrayChange('images', index, 'url', e.target.value)} 
                        placeholder="Paste full public URL to image" 
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                        required
                    />
                    <button type="button" onClick={() => removeArrayField('images', index)} className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-red-300" disabled={bookData.images.length === 1}>
                      <MinusIcon />
                    </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('images', { prefix: '', url: '' })} className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800">
              <PlusIcon /> Add Another Image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Authors</label>
              {bookData.author.map((author, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input type="text" value={author} onChange={(e) => handleArrayChange('author', index, null, e.target.value)} placeholder="e.g., H.C. Verma" className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                  <button type="button" onClick={() => removeArrayField('author', index)} className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-red-300" disabled={bookData.author.length === 1}>
                    <MinusIcon />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayField('author')} className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800">
                <PlusIcon /> Add Author
              </button>
            </div>
            <div>
              <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
              <input type="text" name="publisher" id="publisher" value={bookData.publisher} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                {bookData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <input type="text" value={tag} onChange={(e) => handleArrayChange('tags', index, null, e.target.value)} placeholder="e.g., Physics" className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        <button type="button" onClick={() => removeArrayField('tags', index)} className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-red-300" disabled={bookData.tags.length === 1}><MinusIcon /></button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayField('tags')} className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"><PlusIcon /> Add Tag</button>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                {bookData.class.map((c, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <input type="number" value={c} onChange={(e) => handleArrayChange('class', index, null, e.target.value)} placeholder="e.g., 11" className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                        <button type="button" onClick={() => removeArrayField('class', index)} className="p-2 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-red-300" disabled={bookData.class.length === 1}><MinusIcon /></button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayField('class')} className="mt-1 flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"><PlusIcon /> Add Class</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-t pt-6">
            <div>
              <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700 mb-1">New Price (₹)</label>
              <input type="number" name="newPrice" id="newPrice" value={bookData.newPrice} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="newPriceDiscount" className="block text-sm font-medium text-gray-700 mb-1">Discounted New (₹)</label>
              <input type="number" name="newPriceDiscount" id="newPriceDiscount" value={bookData.newPriceDiscount} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="preOwnedPrice" className="block text-sm font-medium text-gray-700 mb-1">Pre-Owned Price (₹)</label>
              <input type="number" name="preOwnedPrice" id="preOwnedPrice" value={bookData.preOwnedPrice} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="preOwnedPriceDiscount" className="block text-sm font-medium text-gray-700 mb-1">Discounted Pre-Owned (₹)</label>
              <input type="number" name="preOwnedPriceDiscount" id="preOwnedPriceDiscount" value={bookData.preOwnedPriceDiscount} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
          
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Additional Details (HTML)</label>
            <textarea name="details" id="details" rows="6" value={bookData.details} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
          </div>

          <div className="flex items-center justify-between border-t pt-6">
            <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Save Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Addbook;

