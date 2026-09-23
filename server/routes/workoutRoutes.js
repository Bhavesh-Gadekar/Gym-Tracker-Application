import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {createWorkout,getWorkouts,getWorkoutById,updateWorkout,deleteWorkout} from "../controllers/workoutController.js";

const router = express.Router();

router.post("/", authMiddleware, createWorkout);
router.get("/", authMiddleware, getWorkouts);
router.get("/:id", authMiddleware, getWorkoutById);
router.put("/:id", authMiddleware, updateWorkout);
router.delete("/:id", authMiddleware, deleteWorkout);

export default router;