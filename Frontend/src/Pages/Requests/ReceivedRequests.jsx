import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReceivedRequests = () => {
    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);

    // Fetch received friend requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/friends/allRequests`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                });
                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching friend requests:", error);
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

        fetchRequests();
        fetchFriends();
    }, []);

    // Check if the requester is already a friend
    const isFriend = (userId) => friends.some((friend) => friend._id === userId);

    // Handle accepting or rejecting a request
    const handleResponse = async (requestId, action) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/friends/respond`,
                { requesterId: requestId, action },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            // Refetch requests after handling
            const updatedRequests = await axios.get(`${import.meta.env.VITE_API_URL}/friends/requests`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setRequests(updatedRequests.data);
        } catch (error) {
            console.error("Error responding to friend request:", error);
        }
    };

    return (
        <div className="h-full flex flex-col items-center bg-zinc-700 p-4">
            <h2 className="text-2xl font-bold mb-4">Received Friend Requests</h2>

            {/* Requests List */}
            <div className="w-full max-w-md">
                {requests.length > 0 ? (
                    requests.map((request) => (
                        <div key={request._id} className="flex justify-between items-center p-2 bg-white shadow mb-2 rounded-md">
                            <span>{request.username}</span>
                            <div>
                                {/* Show Accept/Reject only if the requester is not a friend */}
                                {!isFriend(request._id) && (
                                    <>
                                        <button
                                            onClick={() => handleResponse(request._id, 'accept')}
                                            className="bg-green-500 text-white px-4 py-1 rounded-md mr-2"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleResponse(request._id, 'reject')}
                                            className="bg-red-500 text-white px-4 py-1 rounded-md"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No received requests</p>
                )}
            </div>
        </div>
    );
};

export default ReceivedRequests;
