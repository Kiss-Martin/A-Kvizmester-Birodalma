function updateScoreDisplays() {
    // Update Quiz score
    const quizScoreElement = document.getElementById('quizTimeScore');
    if (quizScoreElement) {
        const totalQuizScore = localStorage.getItem('totalQuizScore') || '0';
        quizScoreElement.textContent = totalQuizScore;
    }
    
    // Update Hangman score
    const hangmanScoreElement = document.getElementById('hangmanScore');
    if (hangmanScoreElement) {
        const highscore = localStorage.getItem('hangmanHighScore') || '0';
        hangmanScoreElement.textContent = highscore;
    }
    
    // Update Válasz-Viszály scores
    const player1ScoreElement = document.getElementById('player1Score');
    const player2ScoreElement = document.getElementById('player2Score');
    
    const player1Score = localStorage.getItem('player1TotalScore') || '0';
    const player2Score = localStorage.getItem('player2TotalScore') || '0';
    
    if (player1ScoreElement) {
        player1ScoreElement.textContent = player1Score;
    }
    if (player2ScoreElement) {
        player2ScoreElement.textContent = player2Score;
    }
}

// Call this function on page load
updateScoreDisplays();

// Update scores when localStorage changes
window.addEventListener('storage', updateScoreDisplays);

// Also update on DOMContentLoaded
document.addEventListener('DOMContentLoaded', updateScoreDisplays);