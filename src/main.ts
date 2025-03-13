function updateScoreDisplays() {
    const quizScoreElement = document.getElementById('quizTimeScore');
    if (quizScoreElement) {
        const totalQuizScore = localStorage.getItem('totalQuizScore') || '0';
        quizScoreElement.textContent = totalQuizScore;
    }
}

updateScoreDisplays();

window.addEventListener('storage', updateScoreDisplays);
