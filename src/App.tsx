// src/App.tsx
import React, { useState, useEffect } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import GamePage from "./pages/GamePage";

const App: React.FC = () => {

    const [userId, setUserId] = useState<string | null>(null);
    const [eligibility, setEligibility] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true); 
    const [genderRevealOnly, setGenderRevealOnly] = useState<boolean>(false);

    useEffect(() => {
        const savedGenderRevealOnly = localStorage.getItem("genderRevealOnly");
        if (savedGenderRevealOnly) {
            setGenderRevealOnly(savedGenderRevealOnly === "true");
        }
    }, []);
    
    useEffect(() => {
        localStorage.setItem("genderRevealOnly", genderRevealOnly.toString());
    }, [genderRevealOnly]);

    // Load `userId` and `eligibility` from localStorage on initial render (when the app first loads)
    useEffect(() => {
        const savedUserId = localStorage.getItem("userId"); // Retrieve userId from localStorage
        const savedEligibility = localStorage.getItem("eligibility"); // Retrieve eligibility from localStorage

        console.log("Saved userId:", savedUserId);
        console.log("Saved eligibility:", savedEligibility);

        if (savedUserId) {
            setUserId(savedUserId);
            console.log("UserId set to:", savedUserId);
        }
        if (savedEligibility) {
            setEligibility(savedEligibility === "true");
            console.log("Eligibility set to:", savedEligibility === "true");
        }

        setIsLoading(false); // Mark loading as complete
    }, []); // Empty dependency array means this effect runs only once when the component mounts

    // Save `userId` to localStorage whenever it changes
    useEffect(() => {
        if (userId) {
            localStorage.setItem("userId", userId); // Save userId to localStorage if it's not null
        } else {
            localStorage.removeItem("userId"); // Remove userId from localStorage if it's null (e.g., on logout)
        }
    }, [userId]); // Runs whenever `userId` changes

    // Save `eligibility` to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("eligibility", eligibility.toString()); // Save eligibility as a string ("true"/"false")
    }, [eligibility]); // Runs whenever `eligibility` changes

    if (isLoading) {
        return <div>Loading...</div>; // Replace with your preferred loading UI
    }

    console.log("Current userId state:", userId);

    return (
        <Router>
    <Routes>
        {/* Root Route - Redirect Based on User Status */}
        <Route
            path="/"
            element={
                !userId ? (
                    <Navigate to="/login" replace />
                ) : genderRevealOnly ? (
                    <Navigate to="/game" replace />
                ) : (
                    <Navigate to="/card" replace />
                )
            }
        />

        {/* Login Route - Ensure Proper Redirection for Logged-in Users */}
        <Route
            path="/login"
            element={
                userId ? (
                    <Navigate to={genderRevealOnly ? "/game" : "/card"} replace />
                ) : (
                    <Login setUserId={setUserId} setGenderRevealOnly={setGenderRevealOnly} />
                )
            }
        />

        {/* Card Page - Restrict Unauthorized & Gender-Restricted Users */}
        <Route
            path="/card"
            element={
                !userId ? (
                    <Navigate to="/login" replace />
                ) : genderRevealOnly ? (
                    <Navigate to="/game" replace />
                ) : (
                    <Home userId={userId} eligibility={eligibility} setEligibility={setEligibility} />
                )
            }
        />

        {/* Game Page - Ensure Only Logged-in Users Can Access */}
        <Route
            path="/game"
            element={
                userId ? (
                    <GamePage userId={userId} genderRevealOnly={genderRevealOnly} setEligibility={setEligibility} />
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
