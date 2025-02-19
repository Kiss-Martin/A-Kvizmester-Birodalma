"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const quizScoreElement = document.getElementById('quizTimeScore');
    const totalScore = localStorage.getItem('totalQuizScore') || '0';
    if (quizScoreElement) {
        quizScoreElement.textContent = totalScore;
    }
});
