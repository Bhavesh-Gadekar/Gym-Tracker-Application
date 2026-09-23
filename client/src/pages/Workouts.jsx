import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../services/api.js";

const Workouts = () => {
    const [exercises, setExercises] = useState([]);
    const [workouts, setWorkouts] = useState([]);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        notes: "",
        exercises: []
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [exerciseResponse, workoutResponse] =
                    await Promise.all([
                        api.get("/exercises"),
                        api.get("/workouts")
                    ]);

                setExercises(exerciseResponse.data.exercises);
                setWorkouts(workoutResponse.data.workouts);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load workout data"
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleAddExercise = () => {
        setFormData((previous) => ({
            ...previous,
            exercises: [
                ...previous.exercises,
                {
                    exercise: "",
                    sets: [
                        {
                            weight: "",
                            reps: ""
                        }
                    ]
                }
            ]
        }));
    };

    const handleRemoveExercise = (exerciseIndex) => {
        setFormData((previous) => ({
            ...previous,
            exercises: previous.exercises.filter(
                (_, index) => index !== exerciseIndex
            )
        }));
    };

    const handleExerciseChange = (
        exerciseIndex,
        value
    ) => {
        setFormData((previous) => {
            const updatedExercises = [...previous.exercises];

            updatedExercises[exerciseIndex] = {
                ...updatedExercises[exerciseIndex],
                exercise: value
            };

            return {
                ...previous,
                exercises: updatedExercises
            };
        });
    };

    const handleAddSet = (exerciseIndex) => {
        setFormData((previous) => {
            const updatedExercises = [...previous.exercises];

            updatedExercises[exerciseIndex] = {
                ...updatedExercises[exerciseIndex],
                sets: [
                    ...updatedExercises[exerciseIndex].sets,
                    {
                        weight: "",
                        reps: ""
                    }
                ]
            };

            return {
                ...previous,
                exercises: updatedExercises
            };
        });
    };

    const handleRemoveSet = (
        exerciseIndex,
        setIndex
    ) => {
        setFormData((previous) => {
            const updatedExercises = [...previous.exercises];

            updatedExercises[exerciseIndex] = {
                ...updatedExercises[exerciseIndex],
                sets: updatedExercises[
                    exerciseIndex
                ].sets.filter(
                    (_, index) => index !== setIndex
                )
            };

            return {
                ...previous,
                exercises: updatedExercises
            };
        });
    };

    const handleSetChange = (
        exerciseIndex,
        setIndex,
        field,
        value
    ) => {
        setFormData((previous) => {
            const updatedExercises = [...previous.exercises];

            const updatedSets = [
                ...updatedExercises[exerciseIndex].sets
            ];

            updatedSets[setIndex] = {
                ...updatedSets[setIndex],
                [field]: value
            };

            updatedExercises[exerciseIndex] = {
                ...updatedExercises[exerciseIndex],
                sets: updatedSets
            };

            return {
                ...previous,
                exercises: updatedExercises
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (formData.exercises.length === 0) {
            setError(
                "Add at least one exercise to the workout"
            );
            return;
        }

        const hasInvalidExercise =
            formData.exercises.some(
                (workoutExercise) =>
                    !workoutExercise.exercise ||
                    workoutExercise.sets.length === 0 ||
                    workoutExercise.sets.some(
                        (set) =>
                            set.weight === "" ||
                            set.reps === ""
                    )
            );

        if (hasInvalidExercise) {
            setError(
                "Please complete all exercise and set fields"
            );
            return;
        }

        try {
            const payload = {
                date: formData.date,
                notes: formData.notes,
                exercises: formData.exercises.map(
                    (workoutExercise) => ({
                        exercise:
                            workoutExercise.exercise,
                        sets: workoutExercise.sets.map(
                            (set) => ({
                                weight: Number(set.weight),
                                reps: Number(set.reps)
                            })
                        )
                    })
                )
            };

            const response = await api.post(
                "/workouts",
                payload
            );

            setWorkouts((previous) => [
                response.data.workout,
                ...previous
            ]);

            setFormData({
                date: new Date()
                    .toISOString()
                    .split("T")[0],
                notes: "",
                exercises: []
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create workout"
            );
        }
    };

    if (loading) {
        return <p>Loading workouts...</p>;
    }

    return (
        <>
            <Navbar />

            <main>
                <h1>Workout Logging</h1>

                {error && <p>{error}</p>}

                <section>
                    <h2>Log Workout</h2>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Date</label>

                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        date: e.target.value
                                    })
                                }
                                required
                            />
                        </div>

                        <div>
                            <label>Notes</label>

                            <textarea
                                value={formData.notes}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        notes: e.target.value
                                    })
                                }
                                placeholder="How was your workout?"
                            />
                        </div>

                        {formData.exercises.map(
                            (
                                workoutExercise,
                                exerciseIndex
                            ) => (
                                <div
                                    key={exerciseIndex}
                                >
                                    <h3>
                                        Exercise{" "}
                                        {exerciseIndex + 1}
                                    </h3>

                                    <select
                                        value={
                                            workoutExercise.exercise
                                        }
                                        onChange={(e) =>
                                            handleExerciseChange(
                                                exerciseIndex,
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select exercise
                                        </option>

                                        {exercises.map(
                                            (exercise) => (
                                                <option
                                                    key={
                                                        exercise._id
                                                    }
                                                    value={
                                                        exercise._id
                                                    }
                                                >
                                                    {
                                                        exercise.name
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveExercise(
                                                exerciseIndex
                                            )
                                        }
                                    >
                                        Remove Exercise
                                    </button>

                                    {workoutExercise.sets.map(
                                        (
                                            set,
                                            setIndex
                                        ) => (
                                            <div
                                                key={
                                                    setIndex
                                                }
                                            >
                                                <span>
                                                    Set{" "}
                                                    {setIndex +
                                                        1}
                                                </span>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.5"
                                                    placeholder="Weight (kg)"
                                                    value={
                                                        set.weight
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleSetChange(
                                                            exerciseIndex,
                                                            setIndex,
                                                            "weight",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder="Reps"
                                                    value={
                                                        set.reps
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleSetChange(
                                                            exerciseIndex,
                                                            setIndex,
                                                            "reps",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                />

                                                {workoutExercise
                                                    .sets
                                                    .length >
                                                    1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveSet(
                                                                exerciseIndex,
                                                                setIndex
                                                            )
                                                        }
                                                    >
                                                        Remove Set
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddSet(
                                                exerciseIndex
                                            )
                                        }
                                    >
                                        + Add Set
                                    </button>
                                </div>
                            )
                        )}

                        <button
                            type="button"
                            onClick={handleAddExercise}
                        >
                            + Add Exercise
                        </button>

                        <button type="submit">
                            Save Workout
                        </button>
                    </form>
                </section>

                <section>
                    <h2>Workout History</h2>

                    {workouts.length === 0 ? (
                        <p>No workouts logged yet.</p>
                    ) : (
                        workouts.map((workout) => (
                            <div key={workout._id}>
                                <h3>
                                    {new Date(
                                        workout.date
                                    ).toLocaleDateString()}
                                </h3>

                                {workout.exercises.map(
                                    (
                                        workoutExercise
                                    ) => (
                                        <div
                                            key={
                                                workoutExercise._id
                                            }
                                        >
                                            <strong>
                                                {
                                                    workoutExercise
                                                        .exercise
                                                        ?.name
                                                }
                                            </strong>

                                            <ul>
                                                {workoutExercise.sets.map(
                                                    (
                                                        set,
                                                        index
                                                    ) => (
                                                        <li
                                                            key={
                                                                index
                                                            }
                                                        >
                                                            Set{" "}
                                                            {index +
                                                                1}
                                                            :{" "}
                                                            {
                                                                set.weight
                                                            }{" "}
                                                            kg ×{" "}
                                                            {
                                                                set.reps
                                                            }{" "}
                                                            reps
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )
                                )}

                                {workout.notes && (
                                    <p>
                                        Notes:{" "}
                                        {workout.notes}
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </section>
            </main>
        </>
    );
};

export default Workouts;