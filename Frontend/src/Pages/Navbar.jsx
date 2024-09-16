import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear local storage
        localStorage.clear();
        // Redirect to the login or home page
        setTimeout(() => {
        navigate('/login');
        },2000)
    };

    return (
        <div className="flex h-screen bg-gray-800 text-white ">
            <div className="w-64 p-4 bg-gray-900">
                <h1 className="text-2xl font-bold mb-6">Friend Connect</h1>
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
                                to="/chat"
                                className="block px-4 py-2 rounded-md hover:bg-gray-700"
                            >
                                Chat
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
