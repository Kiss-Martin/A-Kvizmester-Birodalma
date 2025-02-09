document.addEventListener('DOMContentLoaded', (): void => {
    const quizScoreElement: HTMLElement | null = document.getElementById('quizTimeScore');
    const totalScore: string = localStorage.getItem('totalQuizScore') || '0';
    
    if (quizScoreElement) {
        quizScoreElement.textContent = totalScore;
    }
});
