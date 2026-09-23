import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../services/api.js";

const createEmptyWorkout = () => ({
    date: new Date().toISOString().split("T")[0],
    notes: "",
    exercises: []
});

const Workouts = () => {
    const [exercises, setExercises] = useState([]);
    const [workouts, setWorkouts] = useState([]);

    const [formData, setFormData] =
        useState(createEmptyWorkout());

    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
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

    useEffect(() => {
        fetchData();
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
            const updatedExercises = [
                ...previous.exercises
            ];

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
            const updatedExercises = [
                ...previous.exercises
            ];

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
            const updatedExercises = [
                ...previous.exercises
            ];

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
            const updatedExercises = [
                ...previous.exercises
            ];

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

    const resetForm = () => {
        setFormData(createEmptyWorkout());
        setEditingId(null);
        setError("");
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

        try {
            if (editingId) {
                await api.put(
                    `/workouts/${editingId}`,
                    payload
                );
            } else {
                await api.post(
                    "/workouts",
                    payload
                );
            }

            resetForm();
            fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save workout"
            );
        }
    };

    const handleEdit = (workout) => {
        setEditingId(workout._id);

        setFormData({
            date: new Date(workout.date)
                .toISOString()
                .split("T")[0],

            notes: workout.notes || "",

            exercises: workout.exercises.map(
                (workoutExercise) => ({
                    exercise:
                        workoutExercise.exercise._id,

                    sets: workoutExercise.sets.map(
                        (set) => ({
                            weight: set.weight,
                            reps: set.reps
                        })
                    )
                })
            )
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this workout?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/workouts/${id}`);

            if (editingId === id) {
                resetForm();
            }

            fetchData();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete workout"
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
                    <h2>
                        {editingId
                            ? "Edit Workout"
                            : "Log Workout"}
                    </h2>

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
                            {editingId
                                ? "Update Workout"
                                : "Save Workout"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                            >
                                Cancel Edit
                            </button>
                        )}
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

                                <div className="button-group">
                                    <button
                                        onClick={() =>
                                            handleEdit(workout)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                workout._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>
        </>
    );
};

export default Workouts;