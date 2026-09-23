import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getWorkoutStreak } from "../controllers/streakController.js";

const router = express.Router();

router.get("/", authMiddleware, getWorkoutStreak);

export default router;