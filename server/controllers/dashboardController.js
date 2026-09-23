import Workout from "../models/Workout.js";

export const getDashboardStats=async(req,res) => {
    try {
        const workouts = await Workout.find({
            user: req.userId
        });
        const totalWorkouts = workouts.length;
        let totalExercisesPerformed = 0;
        let totalVolume = 0;
        workouts.forEach((workout) => {
            workout.exercises.forEach((exercise) => {
                totalExercisesPerformed++;
                exercise.sets.forEach((set) => {
                    totalVolume += set.weight * set.reps;
                });
            });
        });
        // Get the start of the current week (Monday)
        const today = new Date();
        const day = today.getDay();
        const daysFromMonday = day === 0 ? 6 : day - 1;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - daysFromMonday);
        startOfWeek.setHours(0, 0, 0, 0);
        const workoutsThisWeek = workouts.filter(
            (workout) => new Date(workout.date) >= startOfWeek
        ).length;
        res.json({
            totalWorkouts,
            totalExercisesPerformed,
            totalVolume,
            workoutsThisWeek
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};