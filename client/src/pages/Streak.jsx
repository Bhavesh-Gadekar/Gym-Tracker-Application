import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import api from "../services/api.js";

const Streak = () => {
    const [streak, setStreak] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStreak = async () => {
            try {
                const response = await api.get("/streak");

                setStreak(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load workout streak"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStreak();
    }, []);

    if (loading) {
        return <p>Loading streak...</p>;
    }

    return (
        <>
            <Navbar />

            <main>
                <h1>🔥 Workout Streak</h1>

                {error && <p>{error}</p>}

                {streak && (
                    <section className="card-grid streak-grid">
                        <div>
                            <h2>⚡ Current Streak</h2>
                            <p>
                                {streak.currentStreak} days
                            </p>
                        </div>

                        <div>
                            <h2>🌟 Longest Streak</h2>
                            <p>
                                {streak.longestStreak} days
                            </p>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
};

export default Streak;