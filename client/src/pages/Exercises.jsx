import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../services/api.js";

const Exercises = () => {
    const [exercises, setExercises] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchExercises = async () => {
        try {
            const response = await api.get("/exercises");
            setExercises(response.data.exercises);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load exercises"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExercises();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setFormData({
            name: "",
            category: "",
            description: ""
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (editingId) {
                await api.put(
                    `/exercises/${editingId}`,
                    formData
                );
            } else {
                await api.post("/exercises", formData);
            }
            resetForm();
            fetchExercises();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to save exercise"
            );
        }
    };

    const handleEdit = (exercise) => {
        setEditingId(exercise._id);
        setFormData({
            name: exercise.name,
            category: exercise.category,
            description: exercise.description || ""
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this exercise?"
        );
        if (!confirmed) {
            return;
        }
        try {
            await api.delete(`/exercises/${id}`);
            fetchExercises();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete exercise"
            );
        }
    };

    return (
        <>
            <Navbar />
            <main>
                <h1>Exercise Management</h1>
                {error && <p>{error}</p>}
                <section>
                    <h2>
                        {editingId
                            ? "Edit Exercise"
                            : "Add Exercise"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Bench Press"
                                required
                            />
                        </div>
                        <div>
                            <label>Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g. Chest"
                                required
                            />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Exercise description"
                            />
                        </div>
                        <button type="submit">
                            {editingId
                                ? "Update Exercise"
                                : "Add Exercise"}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </form>
                </section>
                <section>
                    <h2>Your Exercises</h2>
                    {loading ? (
                        <p>Loading exercises...</p>
                    ) : exercises.length === 0 ? (
                        <p>No exercises found.</p>
                    ) : (
                        exercises.map((exercise) => (
                            <div key={exercise._id}>
                                <h3>{exercise.name}</h3>
                                <p>
                                    Category: {exercise.category}
                                </p>
                                {exercise.description && (
                                    <p>
                                        {exercise.description}
                                    </p>
                                )}
                                <div className="button-group">
                                    <button
                                        onClick={() =>
                                            handleEdit(exercise)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(exercise._id)
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

export default Exercises;