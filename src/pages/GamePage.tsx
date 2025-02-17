import React, { useState, useEffect } from 'react';
import DraggableList from '../components/DraggableList';
import { useNavigate } from "react-router-dom";
import '../App.css';
import './GamePage.css';
import { updateUserEligibility } from '../service/api';

type GamePageProps = {
    userId: string;
    genderRevealOnly: boolean
    setEligibility: (eligibility: boolean) => void;
};

const GamePage: React.FC<GamePageProps>= ({ userId, genderRevealOnly, setEligibility }) => {
    const [isFirstListCorrect, setIsFirstListCorrect] = useState(false);
    const [isSecondListCorrect, setIsSecondListCorrect] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const navigate = useNavigate(); // Hook to handle navigation

    useEffect(() => {
        // This will check the game status after state updates have been applied
        if (isFirstListCorrect && isSecondListCorrect) {
            console.log("Both lists are correct! Update user eligibility and setGameCompleted to true...");
            updateUserEligibility(userId, true).then(() => {
                setEligibility(true); // Update global eligibility state after game completion
            });

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
            <div className="draggable-list-wrapper">
                 <DraggableList items={'K N H T I'.split(' ')} onOrderChange={setIsFirstListCorrect} targetWord="THINK" />
                 <DraggableList items={'K N P I'.split(' ')} onOrderChange={setIsSecondListCorrect} targetWord="PINK" />
            </div>
            {gameCompleted && (
                <>
                    <div className="game-completion-message1">
                        Well done!
                    </div>
                    <div className="game-completion-message2">
                        It's a Girl!!
                    </div>
                </>                
            )}
            {gameCompleted && !genderRevealOnly && (
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
