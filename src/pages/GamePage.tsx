import React from 'react';
import DraggableList from '../components/DraggableList';
import '../App.css'; // Make sure your App.css is imported

const GamePage = () => {
    return (
        <div className="GamePage-container">
            <h1>Game Page</h1>
            <DraggableList items={'I P B T K I N L H'.split(' ')} />
        </div>
    );
};

export default GamePage;
