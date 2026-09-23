import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createExercise,getExercises,updateExercise,deleteExercise } from "../controllers/exerciseController.js";

const router = express.Router();

router.post("/", authMiddleware, createExercise);
router.get("/", authMiddleware, getExercises);
router.put("/:id", authMiddleware, updateExercise);
router.delete("/:id", authMiddleware, deleteExercise);

export default router;