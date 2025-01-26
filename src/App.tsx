// src/App.tsx
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import GamePage from "./pages/GamePage";

const App: React.FC = () => {
    const [user, setUser] = useState<{ userId: number; eligibility: boolean } | null>(null);

    // Optional: Load user from localStorage on initial render
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Optional: Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    return (
        <Router>
            <Routes>
                {/* Root route logic */}
                <Route
                    path="/"
                    element={
                        user?.eligibility
                            ? <Navigate to="/card" replace />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* Login route */}
                <Route path="/login" element={<Login setUser={setUser} />} />

                {/* Home route */}
                <Route
                    path="/card"
                    element={
                        user?.eligibility ? (
                            <Home userId={user.userId} />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* Game route */}
                <Route
                    path="/game"
                    element={
                        user?.eligibility ? (
                            <GamePage />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

            </Routes>
        </Router>
    );
};

export default App;
