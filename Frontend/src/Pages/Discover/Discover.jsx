import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Discover = () => {
    const [recommendations, setRecommendations] = useState([]);

    // Fetch recommendations
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/friends/recommendations`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                const userId = JSON.parse(localStorage.getItem("userId"));
                const filtered = response.data.recommendations.filter(user => user._id !== userId);
                setRecommendations(filtered);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
                toast.error('Failed to fetch recommendations.');
            }
        };

        fetchRecommendations();
    }, []);

    // Handle sending a friend request
    const handleAddFriend = async (userId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/friends/request`,
                { recipientId: userId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            toast.success('Friend request sent!');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`Failed to send friend request: ${error.response.data.message}`);
            } else {
                toast.error('An error occurred while sending the friend request.');
            }
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center bg-zinc-700 p-4">
            <h2 className="text-2xl font-bold mb-10">Discover New Friends Based on mutual connection
                & Interests
            </h2>

            {/* Recommendations List */}
            <div className="w-full max-w-md">
                {recommendations.length > 0 ? (
                    recommendations.map((user) => (
                        <div key={user._id} className="flex justify-between items-center p-2 bg-white shadow mb-2 rounded-md">
                            <span>{user.username}</span>
                            <button
                                onClick={() => handleAddFriend(user._id)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Add Friend
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No recommendations available</p>
                )}
            </div>

            <ToastContainer /> {/* Add ToastContainer here */}
        </div>
    );
};

export default Discover;
