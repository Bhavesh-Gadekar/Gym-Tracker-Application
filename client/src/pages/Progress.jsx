import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../services/api.js";

const Progress = () => {
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await api.get("/progress");

                setProgress(response.data.progress);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load progress"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    const formatOneRepMax = (value) => {
        return value.toFixed(2);
    };

    if (loading) {
        return <p>Loading progress...</p>;
    }

    return (
        <>
            <Navbar />

            <main>
                <h1>Progress Tracking</h1>

                {error && <p>{error}</p>}

                {progress.length === 0 ? (
                    <p>
                        No workout data available yet.
                    </p>
                ) : (
                    progress.map((item) => (
                        <section key={item.exercise._id} className="progress-card">
                            <h2>{item.exercise.name}</h2>

                            <p>
                                Category:{" "}
                                {item.exercise.category}
                            </p>

                            <div>
                                <h3>Current Session</h3>

                                <p>
                                    Date:{" "}
                                    {formatDate(
                                        item.currentSession.date
                                    )}
                                </p>

                                <p>
                                    Best Set:{" "}
                                    {
                                        item.currentSession
                                            .bestSet.weight
                                    }{" "}
                                    kg ×{" "}
                                    {
                                        item.currentSession
                                            .bestSet.reps
                                    }{" "}
                                    reps
                                </p>

                                <p>
                                    Estimated 1RM:{" "}
                                    {formatOneRepMax(
                                        item.currentSession
                                            .estimatedOneRepMax
                                    )}{" "}
                                    kg
                                </p>
                            </div>

                            <div>
                                <h3>Previous Session</h3>

                                {item.previousSession ? (
                                    <>
                                        <p>
                                            Date:{" "}
                                            {formatDate(
                                                item
                                                    .previousSession
                                                    .date
                                            )}
                                        </p>

                                        <p>
                                            Best Set:{" "}
                                            {
                                                item
                                                    .previousSession
                                                    .bestSet
                                                    .weight
                                            }{" "}
                                            kg ×{" "}
                                            {
                                                item
                                                    .previousSession
                                                    .bestSet
                                                    .reps
                                            }{" "}
                                            reps
                                        </p>

                                        <p>
                                            Estimated 1RM:{" "}
                                            {formatOneRepMax(
                                                item
                                                    .previousSession
                                                    .estimatedOneRepMax
                                            )}{" "}
                                            kg
                                        </p>
                                    </>
                                ) : (
                                    <p>
                                        No previous session
                                        available.
                                    </p>
                                )}
                            </div>

                            <div>
                                <h3>Personal Bests</h3>

                                <p>
                                    Best Weight:{" "}
                                    {item.bestWeight} kg
                                </p>

                                <p>
                                    Best Reps:{" "}
                                    {item.bestReps}
                                </p>
                            </div>

                            <div>
                                <h3>Status</h3>

                                <p>{item.status}</p>
                            </div>
                        </section>
                    ))
                )}
            </main>
        </>
    );
};

export default Progress;