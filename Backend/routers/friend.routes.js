import { Router } from "express";
import {
    searchUsers,
    sendFriendRequest,
    respondToRequest,
    getFriendsList,
    removeFriend,
    getRecommendations,
    updateUserInterests
} from "../conntroller/friend.controller.js";
import { authMiddleware } from '../middlewares/auth.middlewares.js';

const friendRouter = Router();

friendRouter.get("/search", searchUsers);
friendRouter.post('/request', authMiddleware, sendFriendRequest);
friendRouter.post('/respond', authMiddleware, respondToRequest);
friendRouter.get("/list", getFriendsList);
friendRouter.post("/remove", removeFriend);
friendRouter.get("/recommendations",authMiddleware, getRecommendations);
friendRouter.post("/addInterests",authMiddleware,updateUserInterests)

export { friendRouter };
