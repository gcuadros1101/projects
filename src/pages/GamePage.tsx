import React from 'react';
import DraggableList from '../components/DraggableList';
import '../App.css'; // Make sure your App.css is imported

const GamePage = () => {
    return (
        <div className="GamePage-container">
            <h1>Game Page</h1>
            <DraggableList items={'Lorem ipsum dolor sit'.split(' ')} />
        </div>
    );
};

export default GamePage;
