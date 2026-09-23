import Workout from "../models/Workout.js";

const calculateBestSet = (sets) => {
    return sets.reduce((best, current) => {
        const currentVolume = current.weight * current.reps;
        const bestVolume = best.weight * best.reps;

        return currentVolume > bestVolume ? current : best;
    });
};

const calculateEstimatedOneRepMax = (set) => {
    return set.weight * (1 + set.reps / 30);
};

export const getProgress = async (req, res) => {
    try {
        const workouts = await Workout.find({
            user: req.userId
        })
            .populate("exercises.exercise", "name category")
            .sort({ date: -1 });

        const progressMap = new Map();
        workouts.forEach((workout) => {
            workout.exercises.forEach((workoutExercise) => {
                const exerciseId = workoutExercise.exercise._id.toString();

                if (!progressMap.has(exerciseId)) {
                    progressMap.set(exerciseId, {
                        exercise: workoutExercise.exercise,
                        sessions: []
                    });
                }
                progressMap.get(exerciseId).sessions.push({
                    date: workout.date,
                    sets: workoutExercise.sets
                });
            });
        });

        const progress = Array.from(progressMap.values()).map(
            (exerciseProgress) => {
                const sessions = exerciseProgress.sessions;
                const currentSession = sessions[0];
                const previousSession = sessions[1] || null;
                const currentBestSet = calculateBestSet(
                    currentSession.sets
                );
                const currentEstimatedOneRepMax =
                    calculateEstimatedOneRepMax(currentBestSet);
                let previousBestSet = null;
                let previousEstimatedOneRepMax = null;
                let status = "Maintained";
                if (previousSession) {
                    previousBestSet = calculateBestSet(
                        previousSession.sets
                    );
                    previousEstimatedOneRepMax =
                        calculateEstimatedOneRepMax(previousBestSet);
                    if (
                        currentEstimatedOneRepMax >
                        previousEstimatedOneRepMax
                    ) {
                        status = "Improved";
                    } else if (
                        currentEstimatedOneRepMax <
                        previousEstimatedOneRepMax
                    ) {
                        status = "Decreased";
                    }
                }
                const bestWeight = Math.max(
                    ...sessions.flatMap((session) =>
                        session.sets.map((set) => set.weight)
                    )
                );
                const bestReps = Math.max(
                    ...sessions.flatMap((session) =>
                        session.sets.map((set) => set.reps)
                    )
                );
                return {
                    exercise: exerciseProgress.exercise,
                    currentSession: {
                        date: currentSession.date,
                        bestSet: currentBestSet,
                        estimatedOneRepMax: currentEstimatedOneRepMax
                    },
                    previousSession: previousSession
                        ? {
                              date: previousSession.date,
                              bestSet: previousBestSet,
                              estimatedOneRepMax:
                                  previousEstimatedOneRepMax
                          }
                        : null,
                    bestWeight,
                    bestReps,
                    status
                };
            }
        );
        res.json({
            progress
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};