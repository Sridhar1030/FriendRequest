import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Search users by username
const searchUsers = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const users = await User.find({
        username: { $regex: search, $options: "i" },
    }).select("username");
    res.status(200).json(users);
});

// Send friend request
const sendFriendRequest = asyncHandler(async (req, res) => {
    const { recipientId } = req.body;

    const requester = await User.findById(req.user._id);
    console.log("requester is ", requester);
    const recipient = await User.findById(recipientId);

    if (!recipient) {
        return res.status(404).json({ message: "Recipient not found" });
    }

    if (!Array.isArray(recipient.pendingRequests)) {
        recipient.pendingRequests = [];
    }
    if (!Array.isArray(requester.friendRequestsSent)) {
        requester.friendRequestsSent = [];
    }

    if (recipient.pendingRequests.includes(req.user._id)) {
        return res.status(400).json({ message: "Friend request already sent" });
    }

    recipient.pendingRequests.push(req.user._id);
    requester.friendRequestsSent.push(recipientId);

    await recipient.save({ validateBeforeSave: false });
    await requester.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Friend request sent" });
});

//Accept/Reject

const respondToRequest = asyncHandler(async (req, res) => {
    const { requesterId, action } = req.body;
    const user = await User.findById(req.user._id); // The user receiving the request (B)
    const requester = await User.findById(requesterId); // The user who sent the request (A)

    if (!user || !requester) {
        return res.status(404).json({ message: "User or requester not found" });
    }

    if (!user.pendingRequests.includes(requesterId)) {
        return res.status(400).json({
            message: "No pending friend request found ",
        });
    }
    // If action is 'accept', update both users' friends lists
    if (action === "accept") {
        // Add the requester (A) to the recipient's (B) friends list
        user.friends.push(requesterId);

        // Add the recipient (B) to the requester's (A) friends list
        requester.friends.push(req.user._id);
    }

    // Remove the request from the recipient's pending requests
    user.pendingRequests = user.pendingRequests.filter(
        (id) => id.toString() !== requesterId
    );

    // Save both users
    await user.save({ validateBeforeSave: false });
    await requester.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Friend request processed" });
});

// Get friend list
const getFriendsList = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate(
        "friends",
        "username"
    );
    res.status(200).json(user.friends);
});

// Remove friend
const removeFriend = asyncHandler(async (req, res) => {
    const { friendId } = req.body;

    const user = await User.findById(req.user._id);
    user.friends = user.friends.filter((id) => id.toString() !== friendId);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Friend removed" });
});

//Update interests
const updateUserInterests = asyncHandler(async (req, res) => {
    const { interests } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Update user interests
    user.interests = interests;

    await user.save({ validateBeforeSave: false });
    res.status(200).json({ message: "Interests updated successfully" });
});

// Get friend recommendations based on mutual friends and interests
const getRecommendations = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate("friends");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const { friends, interests } = user;

    // Find users with mutual friends (but exclude the current user's friends and the user themselves)
    const mutualFriendRecommendations = await User.find({
        _id: { $ne: req.user._id }, // Exclude the current user
        friends: { $in: friends }, // Look for users who share mutual friends
        friends: { $ne: req.user._id }, // Exclude current friends
    }).limit(10); // Limit the number of recommendations

    // Find users with mutual interests (but exclude the current user's friends and the user themselves)
    const mutualInterestRecommendations = await User.find({
        _id: { $ne: req.user._id }, // Exclude the current user
        interests: { $in: interests }, // Look for users with matching interests
        friends: { $ne: req.user._id }, // Exclude current friends
    }).limit(10); // Limit the number of recommendations

    // Combine both mutual friends and mutual interests recommendations
    const combinedRecommendations = [
        ...mutualFriendRecommendations,
        ...mutualInterestRecommendations,
    ];

    res.status(200).json({ recommendations: combinedRecommendations });
});

const getAllRequests = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: "pendingRequests",
        select: "username _id", // Select the fields you need
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.pendingRequests);
});

const sentRequests = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: "friendRequestsSent",
        select: "username _id", 
    });
    if(!user){
        return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(user.friendRequestsSent);
})

const cancelFriendRequest = asyncHandler(async (req, res) => {
    const { recipientId } = req.body;
    
    // Find the logged-in user (who sent the request)
    const user = await User.findById(req.user._id);
    
    // Find the recipient (who received the request)
    const recipient = await User.findById(recipientId);
    
    if (!user || !recipient) {
        return res.status(404).json({ message: "User not found" });
    }

    // Remove the recipient from the user's sent requests
    user.friendRequestsSent = user.friendRequestsSent.filter(id => id.toString() !== recipientId);

    // Remove the user from the recipient's pending requests
    recipient.pendingRequests = recipient.pendingRequests.filter(id => id.toString() !== req.user._id.toString());

    // Save both users
    await user.save();
    await recipient.save();

    res.status(200).json({ message: "Friend request canceled successfully" });
});


export {
    searchUsers,
    sendFriendRequest,
    respondToRequest,
    getFriendsList,
    removeFriend,
    getRecommendations,
    updateUserInterests,
    getAllRequests,
    sentRequests,
    cancelFriendRequest
};
