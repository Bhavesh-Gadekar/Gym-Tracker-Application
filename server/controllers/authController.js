import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser=async(req,res) => {
    try {
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            message:"User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch(error){
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const loginUser=async(req,res) => {
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"Email and password are required"
            });
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }
        const isPasswordCorrect=await bcrypt.compare(
            password,
            user.password
        );
        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }
        const token=jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
        res.cookie("token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch(error){
        res.status(500).json({
            message:"Server error",
            error: error.message
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select(
            "_id name email"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.json({
        message: "Logout successful"
    });
};