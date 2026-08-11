import { Router } from "express";
import passport from "passport";
import { handleGoogleSignUp, getUser,addDetails } from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.get('/google',passport.authenticate("google",{scope:['profile','email']}));

authRouter.get('/google/callback',passport.authenticate("google",{session:false,failureRedirect:'/'}),handleGoogleSignUp);

authRouter.patch('/add-details',authMiddleware,addDetails);

authRouter.get('/get-me',authMiddleware,getUser);

export default authRouter;