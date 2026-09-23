import Workout from "../models/Workout.js";

const formatDate = (date) => {
    const localDate = new Date(date);

    return [
        localDate.getFullYear(),
        String(localDate.getMonth() + 1).padStart(2, "0"),
        String(localDate.getDate()).padStart(2, "0")
    ].join("-");
};

export const getWorkoutStreak = async (req, res) => {
    try {
        const workouts = await Workout.find({
            user: req.userId
        }).select("date");

        // 1. Create Set to store unique workout dates
        const dateSet = new Set();

        // 2. Convert each workout date into YYYY-MM-DD
        for (const workout of workouts) {
            dateSet.add(formatDate(workout.date));
        }

        let longestStreak = 0;

        // 3. Traverse all unique dates
        for (const dateString of dateSet) {
            const currentDate = new Date(`${dateString}T00:00:00`);

            // 4. Start counting only if previous day is not present
            const previousDate = new Date(currentDate);
            previousDate.setDate(previousDate.getDate() - 1);

            const previousDateString = formatDate(previousDate);

            if (!dateSet.has(previousDateString)) {
                let count = 1;
                let nextDate = new Date(currentDate);

                // 5. Continue checking next consecutive dates
                while (true) {
                    nextDate.setDate(nextDate.getDate() + 1);

                    const nextDateString = formatDate(nextDate);

                    if (!dateSet.has(nextDateString)) {
                        break;
                    }

                    count++;
                }

                // 6. Update longest streak
                longestStreak = Math.max(
                    longestStreak,
                    count
                );
            }
        }

        // 7. Calculate current streak
        let currentStreak = 0;

        if (dateSet.size > 0) {
            const sortedDates = [...dateSet].sort();

            const latestDateString =
                sortedDates[sortedDates.length - 1];

            const latestDate =
                new Date(`${latestDateString}T00:00:00`);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const todayString = formatDate(today);
            const yesterdayString = formatDate(yesterday);

            // Current streak can continue if the latest workout
            // was today or yesterday.
            if (
                latestDateString === todayString ||
                latestDateString === yesterdayString
            ) {
                let count = 1;
                let currentDate = new Date(latestDate);

                while (true) {
                    currentDate.setDate(
                        currentDate.getDate() - 1
                    );

                    const currentDateString =
                        formatDate(currentDate);

                    if (!dateSet.has(currentDateString)) {
                        break;
                    }

                    count++;
                }

                currentStreak = count;
            }
        }

        res.json({
            currentStreak,
            longestStreak
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};