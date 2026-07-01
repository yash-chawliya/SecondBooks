import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom'; // Import hooks

const AccountPage = () => {
    const { userId, name } = useAuth();
    const navigate = useNavigate(); // Initialize navigate
    const location = useLocation(); // Initialize location
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // State for editing profile
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({ firstName: '', lastName: '', phone: '' });

    // Icon for the home button
    const HomeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;
            try {
                const response = await axios.get('/api/users/profile');
                setUserData(response.data);
                setProfileData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    phone: response.data.phone,
                });
            } catch (error) {
                toast.error('Failed to fetch user data.');
                console.error("Fetch user data error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const promise = axios.put('/api/users/profile', profileData);
        toast.promise(promise, {
            loading: 'Updating profile...',
            success: (response) => {
                setUserData(response.data.user);
                setIsEditing(false);
                return 'Profile updated successfully!';
            },
            error: 'Failed to update profile.',
        });
    };

    const handleDeleteAddress = async (addressToDelete) => {
        const promise = axios.post('/api/addresses/delete', { addressToDelete });
        toast.promise(promise, {
            loading: 'Deleting address...',
            success: (response) => {
                setUserData(response.data.user);
                return 'Address deleted successfully!';
            },
            error: 'Failed to delete address.',
        });
    };

    if (loading) {
        return <div className="text-center p-10">Loading account details...</div>;
    }

    if (!userData) {
        return <div className="text-center p-10">Could not load user data.</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Account</h1>
                <button onClick={() => navigate('/')} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors flex hover:text-blue-500 hover:font-semibold hover:underline" title="Go to Homepage">
                    <HomeIcon /> Home
                </button>

                {/* Profile Details Section */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Your Profile</h2>
                        <button onClick={() => setIsEditing(!isEditing)} className="text-sm text-blue-600 hover:underline">
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>
                    {!isEditing ? (
                        <div className="space-y-2 text-gray-600">
                            <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
                            <p><strong>Email:</strong> {userData.email}</p>
                            <p><strong>Phone:</strong> {userData.phone}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input type="text" name="firstName" value={profileData.firstName} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input type="text" name="lastName" value={profileData.lastName} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                            </div>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
                        </form>
                    )}
                </div>

                {/* Address Management Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Addresses</h2>
                    <div className="space-y-3 mb-6">
                        {userData.address && userData.address.length > 0 ? (
                            userData.address.map((addr, index) => (
                                <div key={index} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                                    <p className="text-gray-700">{addr}</p>
                                    <button onClick={() => handleDeleteAddress(addr)} className="text-sm text-red-500 hover:underline">Delete</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">You have no saved addresses.</p>
                        )}
                    </div>

                    {/* --- FIX: Button to navigate to the address page --- */}
                    <div className="border-t pt-4">
                        <button
                            onClick={() => navigate('/address', { state: { from: location } })}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Add a new address
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;

