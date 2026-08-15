import {Router} from "express";
import { createGroup, joinGroup } from "../controller/group.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js"; 

const router = Router();
router.post("/create", authMiddleware, createGroup);
router.post("/join", authMiddleware, joinGroup);

export default router;