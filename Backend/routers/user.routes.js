import {Router} from 'express';
import { authMiddleware } from '../middlewares/auth.middlewares.js';
import { loginUser, logoutUser, registerUser } from '../conntroller/auth.controller.js';


const userRouter = Router();

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route('/logout').get(authMiddleware, logoutUser)


export {userRouter}