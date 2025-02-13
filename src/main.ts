document.addEventListener('DOMContentLoaded', (): void => {
    const quizScoreElement: HTMLElement | null = document.getElementById('quizTimeScore');
    const player1ScoreElement: HTMLElement | null = document.getElementById('player1Score');
    const player2ScoreElement: HTMLElement | null = document.getElementById('player2Score');
    
    const totalQuizScore: string = localStorage.getItem('totalQuizScore') || '0';
    const player1Score: string = localStorage.getItem('player1TotalScore') || '0';
    const player2Score: string = localStorage.getItem('player2TotalScore') || '0';
    
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