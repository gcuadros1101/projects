import React, { useState, useEffect } from 'react';
import DraggableList from '../components/DraggableList';
import { useNavigate } from "react-router-dom";
import '../App.css';
import './GamePage.css';
import { updateUserEligibility } from '../service/api';


const GamePage: React.FC = () => {
    const [isFirstListCorrect, setIsFirstListCorrect] = useState(false);
    const [isSecondListCorrect, setIsSecondListCorrect] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const navigate = useNavigate(); // Hook to handle navigation

    // TODO: update when we have the acutal userId
    // - pass actual userId to the gamePage OR add whoAmI call to that page
    const userId = '1';

    useEffect(() => {
        // This will check the game status after state updates have been applied
        if (isFirstListCorrect && isSecondListCorrect) {
            console.log("Both lists are correct! Update user eligibility and setGameCompleted to true...");
            updateUserEligibility(userId, true);

            // Delay the action by 200 milliseconds
            setTimeout(() => {
                setGameCompleted(true); // Set the game completion state to true after a delay
            }, 200);
        }
    }, [isFirstListCorrect, isSecondListCorrect]); // Dependencies to watch for changes

    const navigateToCardPage = () => {
        console.log("Game Completed State:", gameCompleted);
        navigate("/card");
    };

    return (
        <div className="GamePage-container">
            <h1>Solve the Puzzle</h1>
            <DraggableList items={'K N H T I'.split(' ')} onOrderChange={setIsFirstListCorrect} targetWord="THINK" />
            <DraggableList items={'K N P I'.split(' ')} onOrderChange={setIsSecondListCorrect} targetWord="PINK" />
            {gameCompleted && (
                <>
                    <div className="game-completion-message1">
                        Well done!
                    </div>
                    <div className="game-completion-message2">
                        It's a Surprise!!
                    </div>
                </>                
            )}
            {gameCompleted && (
                <div className="button-container" style={{ position: 'relative', zIndex: 1 }}>
                    <button className="navigate-button" onClick={navigateToCardPage}>
                        🎉 Return to Invite Details 🎉
                    </button>
                </div>
            )}
        </div>
    );
};

export default GamePage;
