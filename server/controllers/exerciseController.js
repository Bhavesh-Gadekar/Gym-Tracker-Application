import Exercise from "../models/Exercise.js";

export const createExercise=async(req,res) => {
    try {
        const { name,category,description }=req.body;
        if(!name || !category){
            return res.status(400).json({
                message:"Name and category are required"
            });
        }
        const exercise=await Exercise.create({
            name,
            category,
            description,
            user: req.userId
        });
        res.status(201).json({
            message:"Exercise created successfully",
            exercise
        });
    }catch(error){
        res.status(500).json({
            message:"Server error",
            error:error.message
        });
    }
};

export const getExercises=async(req,res) => {
    try{
        const exercises=await Exercise.find({
            user: req.userId
        }).sort({ createdAt: -1 });
        res.json({
            exercises
        });
    }catch(error){
        res.status(500).json({
            message:"Server error",
            error: error.message
        });
    }
};

export const updateExercise=async(req,res) => {
    try{
        const { name,category,description }=req.body;
        const exercise=await Exercise.findOne({
            _id: req.params.id,
            user: req.userId
        });
        if(!exercise){
            return res.status(404).json({
                message:"Exercise not found"
            });
        }
        exercise.name=name ?? exercise.name;
        exercise.category=category ?? exercise.category;
        exercise.description=description ?? exercise.description;
        await exercise.save();
        res.json({
            message:"Exercise updated successfully",
            exercise
        });
    }catch(error){
        res.status(500).json({
            message:"Server error",
            error: error.message
        });
    }
};

export const deleteExercise=async(req,res) => {
    try{
        const exercise=await Exercise.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });
        if(!exercise){
            return res.status(404).json({
                message:"Exercise not found"
            });
        }
        res.json({
            message:"Exercise deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            message:"Server error",
            error:error.message
        });
    }
};