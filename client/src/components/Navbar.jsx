import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav>
            <Link to="/dashboard">
                <strong>🏋️ Gym Tracker</strong>
            </Link>
            <div>
                <Link to="/dashboard">📊 Dashboard</Link>
                <Link to="/exercises">💪 Exercises</Link>
                <Link to="/workouts">📝 Workouts</Link>
                <Link to="/progress">📈 Progress</Link>
                <Link to="/streak">🔥 Streak</Link>
            </div>
            <div>
                {user && <span>Hi, {user.name} 👋</span>}
                <button onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;