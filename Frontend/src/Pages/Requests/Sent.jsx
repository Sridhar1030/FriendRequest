import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sent = () => {
    const [sentRequests, setSentRequests] = useState([]);
    const [friends, setFriends] = useState([]);

    // Fetch sent friend requests
    useEffect(() => {
        const fetchSentRequests = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/friends/sent`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setSentRequests(response.data);
            } catch (error) {
                console.error("Error fetching sent requests:", error);
            }
        };

        const fetchFriends = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/friends/list`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setFriends(response.data);
            } catch (error) {
                console.error("Error fetching friends list:", error);
            }
        };

        fetchSentRequests();
        fetchFriends();
    }, []);

    // Check if the user is a friend
    const isFriend = (userId) => {
        return friends.some(friend => friend._id === userId);
    };

    // Handle canceling a request
    const handleCancelRequest = async (recipientId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/friends/cancel`,
                { recipientId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // Remove canceled request from the list
            setSentRequests(sentRequests.filter((request) => request._id !== recipientId));
        } catch (error) {
            console.error("Error canceling friend request:", error);
        }
    };

    return (
        <div className="h-full flex flex-col items-center bg-zinc-700 p-4">
            <h2 className="text-2xl font-bold mb-4">Sent Friend Requests</h2>

            {/* Sent Requests List */}
            <div className="w-full max-w-md">
                {sentRequests.length > 0 ? (
                    sentRequests.map((request) => (
                        <div key={request._id} className="flex justify-between items-center p-2 bg-white shadow mb-2 rounded-md">
                            <span>{request.username}</span>
                            {!isFriend(request._id) && (
                                <button
                                    onClick={() => handleCancelRequest(request._id)}
                                    className="bg-red-500 text-white px-4 py-1 rounded-md"
                                >
                                    Cancel Request
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No sent requests</p>
                )}
            </div>
        </div>
    );
};

export default Sent;
