"use strict";
function saveScore(gameName, score) {
    const newScore = {
        gameName,
        playerName: "Player", // Can be modified to accept player names
        score,
        date: new Date().toISOString()
    };
    fetch('http://localhost:3000/eredmenyek', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newScore)
    });
}
function getHighScores(gameName) {
    return fetch(`http://localhost:3000/eredmenyek?gameName=${gameName}`)
        .then(response => response.json());
}
