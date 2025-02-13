"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const quizScoreElement = document.getElementById('quizTimeScore');
    const player1ScoreElement = document.getElementById('player1Score');
    const player2ScoreElement = document.getElementById('player2Score');
    const totalQuizScore = localStorage.getItem('totalQuizScore') || '0';
    const player1Score = localStorage.getItem('player1TotalScore') || '0';
    const player2Score = localStorage.getItem('player2TotalScore') || '0';
    if (quizScoreElement) {
        quizScoreElement.textContent = totalQuizScore;
    }
    if (player1ScoreElement) {
        player1ScoreElement.textContent = player1Score;
    }
    if (player2ScoreElement) {
        player2ScoreElement.textContent = player2Score;
    }
});
