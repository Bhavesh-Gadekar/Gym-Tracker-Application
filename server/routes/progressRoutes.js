import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getProgress } from "../controllers/progressController.js";

const router = express.Router();

router.get("/", authMiddleware, getProgress);

export default router;