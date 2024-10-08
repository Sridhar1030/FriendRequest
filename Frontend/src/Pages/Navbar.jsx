import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = JSON.parse(localStorage.getItem('userId'));
            if (userId) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users/${userId}`);
                    setUsername(response.data.username);
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        // Clear local storage
        localStorage.clear();
        // Redirect to the login or home page
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="flex h-screen bg-gray-800 text-white">
            <div className="w-64 p-4 bg-gray-900">
                <h1 className="text-2xl font-bold mb-6">Friend Connect</h1>
                <p className="mb-6">Welcome, {username || 'Guest'}!</p>
                <nav>
                    <ul>
                        <li className="mb-4">
                            <Link
                                to="/"
                                className="block px-4 py-2 rounded-md hover:bg-gray-700"
                            >
                                Home
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link
                                to="/sent"
                                className="block px-4 py-2 rounded-md hover:bg-gray-700"
                            >
                                Friend Requests Sent
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link
                                to="/requests"
                                className="block px-4 py-2 rounded-md hover:bg-gray-700"
                            >
                                Friend Requests Received
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link
                                to="/discover"
                                className="block px-4 py-2 rounded-md hover:bg-gray-700"
                            >
                                Discover
                            </Link>
                        </li>
                        <li className="mb-4">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-700"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;
