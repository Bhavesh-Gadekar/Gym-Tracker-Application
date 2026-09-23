import { useEffect, useState } from "react";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get("/dashboard");
                setStats(response.data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load dashboard"
                );
            }
        };

        fetchDashboard();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!stats) {
        return <p>Loading dashboard...</p>;
    }

    return (<>
    <Navbar />
        <div>
            <h1>Dashboard</h1>

            <div>
                <h2>Total Workouts</h2>
                <p>{stats.totalWorkouts}</p>
            </div>

            <div>
                <h2>Exercises Performed</h2>
                <p>{stats.totalExercisesPerformed}</p>
            </div>

            <div>
                <h2>Total Volume</h2>
                <p>{stats.totalVolume} kg</p>
            </div>

            <div>
                <h2>Workouts This Week</h2>
                <p>{stats.workoutsThisWeek}</p>
            </div>
        </div>
        </>
    );
};

export default Dashboard;