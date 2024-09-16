import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [friends, setFriends] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    // Fetch friends
    useEffect(() => {
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
                toast.error('Failed to fetch friends list.');
            }
        };

        fetchFriends();
    }, []);

    // Check if user is already a friend
    const isFriend = (userId) => {
        return friends.some(friend => friend._id === userId);
    };

    // Handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/friends/search`, {
                params: { search: searchQuery },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            const currentUserId = JSON.parse(localStorage.getItem("userId"));
            const filteredResults = response.data.filter(user => user._id !== currentUserId);
            setSearchResults(filteredResults);
        } catch (error) {
            console.error("Error searching users:", error);
            toast.error('Error searching users.');
        }
    };

    // Handle unfriending
    const handleUnfriend = async (friendId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/friends/remove`,
                { friendId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            setFriends(friends.filter((friend) => friend._id !== friendId));
            toast.success('Friend removed successfully!');
        } catch (error) {
            console.error("Error removing friend:", error);
            toast.error('Failed to remove friend.');
        }
    };

    // Handle adding a friend
    const handleAddFriend = async (friendId) => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/friends/request`,
                { recipientId: friendId },
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
        <div className="w-full h-full flex flex-col items-center bg-zinc-700">
            <h2 className="text-2xl font-bold mt-4 mb-4">Friends List</h2>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
                <input
                    type="text"
                    placeholder="Search users by username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
                    Search
                </button>
            </form>

            {/* Search Results */}
            <div className="w-full max-w-md">
                <h3 className="text-xl font-bold mb-2">Search Results:</h3>
                {searchResults.length > 0 ? (
                    searchResults.map((user) => (
                        <div key={user._id} className="flex justify-between items-center p-2 bg-white shadow mb-2 rounded-md">
                            <span className="text-lg font-medium">{user.username}</span>
                            {!isFriend(user._id) && (
                                <button
                                    onClick={() => handleAddFriend(user._id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Add Friend
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No users found</p>
                )}
            </div>

            {/* Friends List */}
            <div className="w-full max-w-md mt-6">
                <h3 className="text-xl font-bold mb-2">Your Friends:</h3>
                {friends.length > 0 ? (
                    friends.map((friend) => (
                        <div key={friend._id} className="flex justify-between items-center p-2 bg-white shadow mb-2 rounded-md">
                            <span>{friend.username}</span>
                            <button
                                className="bg-red-500 text-white px-4 py-1 rounded-md"
                                onClick={() => handleUnfriend(friend._id)}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))
                ) : (
                    <p>You have no friends added yet.</p>
                )}
            </div>

            <ToastContainer />
        </div>
    );
};

export default Home;
