interface GameScore {
    playerName: string;
    game: string;
    score: number;
    date: string;
}

interface ScoreData {
    scores: GameScore[];
    highScores: {
        hangman: number;
        memory: number;
        rps: number;
    };
}

export async function saveScore(gameName: string, score: number, playerName: string) {
    const newScore: GameScore = {
        playerName,
        game: gameName,
        score: score,
        date: new Date().toISOString()
    };

    try {
        const response = await fetch('http://localhost:3000/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newScore)
        });
        return await response.json();
    } catch (error) {
        console.error('Error saving score:', error);
    }
}

export async function getHighScores(): Promise<ScoreData> {
    const response = await fetch('http://localhost:3000/scores');
    return await response.json();
}
