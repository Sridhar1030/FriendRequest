import { Router } from "express";
import {
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
} from "../conntroller/friend.controller.js";
import { authMiddleware } from '../middlewares/auth.middlewares.js';

const friendRouter = Router();

friendRouter.get("/search", searchUsers);
friendRouter.post('/request', authMiddleware, sendFriendRequest);
friendRouter.get('/allRequests',authMiddleware,getAllRequests)
friendRouter.get('/sent',authMiddleware,sentRequests);
friendRouter.post('/respond', authMiddleware, respondToRequest);
friendRouter.get("/list",authMiddleware,getFriendsList);
friendRouter.post("/remove", authMiddleware,removeFriend);
friendRouter.get("/recommendations",authMiddleware, getRecommendations);
friendRouter.post("/addInterests",authMiddleware,updateUserInterests)
friendRouter.post("/cancel",authMiddleware,cancelFriendRequest);

export { friendRouter };
