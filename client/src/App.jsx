import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Exercises from "./pages/Exercises.jsx";
import Workouts from "./pages/Workouts.jsx";
import Progress from "./pages/Progress.jsx";
import Streak from "./pages/Streak.jsx";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
            }/>
            <Route path="*" element={<Navigate to="/login" replace />}/>
            <Route path="/exercises" element={
                    <ProtectedRoute>
                        <Exercises />
                    </ProtectedRoute>}/>
            <Route path="/workouts" element={
                    <ProtectedRoute>
                        <Workouts />
                    </ProtectedRoute>
            }/>
            <Route path="/progress" element={
                    <ProtectedRoute>
                        <Progress />
                    </ProtectedRoute>
            }/>
            <Route path="/streak" element={
                    <ProtectedRoute>
                        <Streak />
                    </ProtectedRoute>
            }/>
            </Routes>
    );
};

export default App;