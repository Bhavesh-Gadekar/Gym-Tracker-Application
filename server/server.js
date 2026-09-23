import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import authMiddleware from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";

dotenv.config();
connectDB();
const app=express();
const PORT=process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/streak", streakRoutes);

app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        userId: req.userId
    });
});

app.get("/",(req,res) => {
    res.json({message: "Gym Tracker API is running"});
});

app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`);
});