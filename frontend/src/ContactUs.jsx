import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'; // 1. Import axios

// --- Icon Components for visual flair ---
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);
const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);
const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // --- 2. Update handleSubmit to be async and send data ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const promise = axios.post('/api/contact', formData);

        toast.promise(promise, {
            loading: 'Sending your message...',
            success: (response) => {
                // Reset the form on success
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                });
                return response.data.message; // Show success message from API
            },
            error: (error) => {
                return error.response?.data?.message || 'Something went wrong!';
            }
        });
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Get in Touch</h1>
                        <p className="mt-4 text-lg text-gray-500">We'd love to hear from you. Please fill out the form below or contact us using the details provided.</p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Contact Information Section */}
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <LocationIcon />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Our Address</h3>
                                        <p className="text-gray-600">Airport Road, Indore, 452005, India</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <MailIcon />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Email Us</h3>
                                        <a href="mailto:support@secondbooks.online" className="text-blue-600 hover:underline">support@secondbooks.online</a>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <PhoneIcon />
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-700">Call Us</h3>
                                        <p className="text-gray-600">+91 9619356221</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form Section */}
                        <div className="bg-white p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                    <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea name="message" id="message" rows="4" value={formData.message} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactUs;
