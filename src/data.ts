interface GameScore {
    gameName: string;
    playerName: string;
    score: number;
    date: string;
}

function saveScore(gameName: string, score: number) {
    const newScore: GameScore = {
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

function getHighScores(gameName: string): Promise<GameScore[]> {
    return fetch(`http://localhost:3000/eredmenyek?gameName=${gameName}`)
        .then(response => response.json());
}
