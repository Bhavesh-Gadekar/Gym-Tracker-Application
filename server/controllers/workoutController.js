import Workout from "../models/Workout.js";
import Exercise from "../models/Exercise.js";

export const createWorkout=async(req,res) => {
    try{
        const { date,exercises,notes }=req.body;
        if(!date || !exercises || exercises.length === 0){
            return res.status(400).json({
                message:"Date and at least one exercise are required"
            });
        }
        // Verify that all exercises belong to the logged-in user
        const exerciseIds=exercises.map((item) => item.exercise);
        const userExercises=await Exercise.find({
            _id:{ $in: exerciseIds },
            user:req.userId
        });
        if(userExercises.length !== exerciseIds.length){
            return res.status(403).json({
                message:"One or more exercises are invalid"
            });
        }
        // Validate sets
        for(const item of exercises){
            if(!item.sets || item.sets.length === 0){
                return res.status(400).json({
                    message:"Each exercise must have at least one set"
                });
            }
            for(const set of item.sets){
                if(set.weight === undefined || set.weight < 0 || set.reps === undefined || set.reps < 1 ){
                    return res.status(400).json({
                        message:"Each set must have valid weight and reps"
                    });
                }
            }
        }
        const workout=await Workout.create({
            user:req.userId,
            date,
            exercises,
            notes
        });
        res.status(201).json({
            message:"Workout created successfully",
            workout
        });
    }catch(error){
        res.status(500).json({
            message:"Server error",
            error:error.message
        });
    }
};

export const getWorkouts = async (req, res) => {
    try{
        const workouts=await Workout.find({
            user:req.userId 
        })
            .populate("exercises.exercise","name category")
            .sort({ date: -1 });
        res.json({
            workouts
        });
    }catch(error){
        res.status(500).json({
            message:"Server error",
            error:error.message
        });
    }
};

export const getWorkoutById=async(req,res) => {
    try{
        const workout=await Workout.findOne({
            _id:req.params.id,
            user:req.userId
        }).populate("exercises.exercise","name category");
        if(!workout){
            return res.status(404).json({
                message:"Workout not found"
            });
        }
        res.json({workout});
    }catch(error){
        res.status(500).json({
            message:"Server error",
            error:error.message
        });
    }
};

export const updateWorkout=async(req,res) => {
    try{
        const { date,exercises,notes }=req.body;
        const workout=await Workout.findOne({
            _id:req.params.id,
            user:req.userId
        });
        if(!workout){
            return res.status(404).json({
                message:"Workout not found"
            });
        }
        if(exercises){
            const exerciseIds=exercises.map((item) => item.exercise);
            const userExercises=await Exercise.find({
                _id:{ $in:exerciseIds },
                user:req.userId
            });
            if(userExercises.length !== exerciseIds.length){
                return res.status(403).json({
                    message:"One or more exercises are invalid"
                });
            }
        }
        workout.date=date ?? workout.date;
        workout.exercises=exercises ?? workout.exercises;
        workout.notes=notes ?? workout.notes;
        await workout.save();
        res.json({
            message: "Workout updated successfully",
            workout
        });
    } catch (error) {
        res.status(500).json({
            message:"Server error",
            error:error.message
        });
    }
};

export const deleteWorkout=async(req,res) => {
    try{
        const workout=await Workout.findOneAndDelete({
            _id:req.params.id,
            user:req.userId
        });
        if(!workout){
            return res.status(404).json({
                message:"Workout not found"
            });
        }
        res.json({
            message:"Workout deleted successfully"
        });
    }catch(error){
        res.status(500).json({
            message:"Server error",
            error:error.message
        });
    } 
};