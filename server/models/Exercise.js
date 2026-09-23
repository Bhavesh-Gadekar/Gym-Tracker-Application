import mongoose from "mongoose";

const exerciseSchema=new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },
        category:{
            type: String,
            required: true,
            trim: true
        },
        description:{
            type: String,
            trim: true
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);
const Exercise=mongoose.model("Exercise",exerciseSchema);

export default Exercise;