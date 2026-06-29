import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


// A list of Indian States and Union Territories for the dropdown.
const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Lakshadweep", "Puducherry"
];

// Initial state for the form to easily reset it.
const initialFormData = {
    fullName: '',
    phone: '',
    pinCode: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
};

export default function Address() {
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);

    const { userId, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // --- THIS IS THE FIX: Determine where to redirect after success ---
    const from = location.state?.from?.pathname || '/account'; // Default to account page

    // Effect to handle authentication check
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: location } });
        }
    }, [isLoggedIn, navigate, location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const addressParts = [
            formData.fullName,
            formData.addressLine1,
            formData.addressLine2,
            formData.landmark ? `Near ${formData.landmark}` : '',
            `${formData.city}, ${formData.state} - ${formData.pinCode}`,
            'India',
            `Phone: ${formData.phone}`
        ];
        
        const fullAddressString = addressParts.filter(part => part).join(', ');
        const capitalizedAddress = fullAddressString
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        const payload = {
            addressToAdd: capitalizedAddress,
            userId: userId,
        };
        
        const promise = axios.post('/api/add/address', payload);

        toast.promise(promise, {
            loading: 'Saving address...',
            success: (response) => {
                setFormData(initialFormData);
                // --- THIS IS THE FIX: Navigate back to the previous page ---
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 1500); // Wait 1.5s to allow user to read the message
                return response.data.message || 'Address saved successfully!';
            },
            error: (error) => {
                 setIsLoading(false);
                 return error.response?.data?.message || 'Failed to save address.';
            }
        });
        
        // This is handled by toast.promise now
        // setIsLoading(false);
    };

    if (!isLoggedIn) {
        return <div className="bg-slate-100 min-h-screen flex items-center justify-center"><p>Redirecting to login...</p></div>;
    }

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center font-sans p-4">
             <Toaster position="top-right" />
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 md:p-10">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Shipping Address</h1>
                <p className="text-gray-500 mb-8">Please enter your shipping details.</p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                        {/* Full Name */}
                        <div className="md:col-span-2">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-r-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    placeholder="9876543210"
                                    pattern="[6-9][0-9]{9}"
                                    title="Please enter a valid 10-digit Indian mobile number"
                                    required
                                />
                            </div>
                        </div>

                        {/* PIN Code */}
                        <div>
                            <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                            <input
                                type="text"
                                id="pinCode"
                                name="pinCode"
                                value={formData.pinCode}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="e.g. 110001"
                                pattern="\d{6}"
                                title="Please enter a valid 6-digit Indian PIN code"
                                required
                            />
                        </div>

                        {/* Address Line 1 */}
                        <div className="md:col-span-2">
                            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">Address (Flat, House no., Building, Apartment)</label>
                            <input
                                type="text"
                                id="addressLine1"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="A-123, Sunshine Apartments"
                                required
                            />
                        </div>

                        {/* Address Line 2 */}
                        <div className="md:col-span-2">
                            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">Area, Street, Sector, Village</label>
                            <input
                                type="text"
                                id="addressLine2"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="Main Road, Sector 5"
                                required
                            />
                        </div>

                        {/* Landmark */}
                        <div>
                            <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                            <input
                                type="text"
                                id="landmark"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="Near City Hospital"
                            />
                        </div>

                        {/* City / Town */}
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Town / City</label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="New Delhi"
                                required
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <select
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                                required
                            >
                                <option value="" disabled>Select your state</option>
                                {indianStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        {/* Country */}
                        <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                value="India"
                                readOnly
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-500"
                            />
                        </div>
                        
                        {/* Submit Button */}
                        <div className="md:col-span-2 mt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Saving...' : 'Save Address'}
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
}
