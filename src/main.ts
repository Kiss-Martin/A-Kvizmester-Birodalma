function updateScoreDisplays() {
    const quizScoreElement = document.getElementById('quizTimeScore');
    if (quizScoreElement) {
        const totalQuizScore = localStorage.getItem('totalQuizScore') || '0';
        quizScoreElement.textContent = totalQuizScore;
    }
}

updateScoreDisplays();

window.addEventListener('storage', updateScoreDisplays);

document.addEventListener('DOMContentLoaded', () => {
    const hangmanScoreElement = document.getElementById('hangmanScore');
    if (hangmanScoreElement) {
        const highscore = localStorage.getItem('hangmanHighScore') || '0';
        hangmanScoreElement.textContent = highscore;
    }
});
