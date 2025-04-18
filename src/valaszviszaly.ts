interface Question {
    kerdes: string;
    valaszok: string[];
    pontok?: number[];
}
interface Player {
    name: string;
    score: number;
}

let currentPlayer: Player | null = null;
const player1: Player = { name: "(W)", score: 0 };
const player2: Player = { name: "(↑)", score: 0 };
let showQuestion: () => void;

async function fetchQuestions(): Promise<Question[]> {
    try {
        const response = await fetch('http://localhost:3000/valaszok');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Question[] = await response.json();
        return shuffleArray(data).slice(0, 10);
    } catch (error) {
        console.error("Hiba történt a kérdések betöltése során:", error);
        throw error;
    }
}

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

async function valaszViszaly() {
    try {
        const questionList = await fetchQuestions();
        for (const question of questionList) {
            console.log(`Kérdés: ${question.kerdes}`);
            const userAnswer = prompt("Mi a válaszod?")?.trim().toLowerCase();
        }
    } catch (error) {
        console.error("Hiba történt a játék során:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    viszalyData.player1TotalScore = Number(localStorage.getItem('player1TotalScore')) || 0;
    viszalyData.player2TotalScore = Number(localStorage.getItem('player2TotalScore')) || 0;
    
    const questionContainer = document.getElementById('question-text');
    const answerContainer = document.getElementById('answer-container');
    const answerInput = document.getElementById('answer-input') as HTMLInputElement;
    const submitButton = document.getElementById('submit-button');
    const feedback = document.getElementById('feedback');
    const endMessage = document.getElementById('end-message');
    const gameContainer = document.getElementById('game-container');
    const buttoncontainer = document.getElementById('buttoncontainer');
    const reactionTime =  document.getElementById('reactiontime');
    const wimg = document.getElementById('w');
    const upimg = document.getElementById('arrowup');
    let currentQuestionIndex = 0;
    let usedAnswers: string[] = [];
    try {
        const questions = await fetchQuestions();
        showQuestion = () => {
            if (!questionContainer || currentQuestionIndex >= questions.length) return;
            answerInput.focus();
            const question = questions[currentQuestionIndex];
            questionContainer.textContent = question.kerdes;
            answerInput.value = '';
            if (feedback && currentPlayer) {
                feedback.innerHTML = `<h3>Jelenlegi játékos: ${currentPlayer.name}</h3>`;
            }
        };
        function checkAnswer(isPlayerOne: boolean): void {
            currentPlayer = isPlayerOne ? player1 : player2;
            const userAnswer = answerInput.value.trim().toLowerCase();
            const correctAnswers = questions[currentQuestionIndex].valaszok.map(v => v.toLowerCase());
            const answerIndex = correctAnswers.indexOf(userAnswer);
            if (!feedback) return;
            if (correctAnswers.includes(userAnswer) && !usedAnswers.includes(userAnswer)) {
                usedAnswers.push(userAnswer);
                const points = 5 - answerIndex;
                currentPlayer.score += Math.max(1, points);
                feedback.innerHTML = `
                    <h2>Helyes válasz! +<span class="footerScore">${Math.max(1, points)}</span> pont</h2>
                    <h3>${player1.name}: <span class="footerScore">${player1.score}</span> pont</h3>
                    <h3>${player2.name}: <span class="footerScore">${player2.score}</span> pont</h3>`;
                isPlayer1Turn = !isPlayer1Turn;
                currentPlayer = isPlayer1Turn ? player1 : player2;
                if (usedAnswers.length === correctAnswers.length) {
                    handleNextQuestion();
                } else {
                    feedback.innerHTML += `<h3>Következő játékos: ${currentPlayer.name}</h3>`;
                }
            } else {
                handleIncorrectAnswer();
                isPlayer1Turn = !isPlayer1Turn;
                currentPlayer = isPlayer1Turn ? player1 : player2;
                feedback.innerHTML += `<h3>Következő játékos: ${currentPlayer.name}</h3>`;
            }
            answerInput.value = '';
        }
        function handleNextQuestion(): void {
            currentQuestionIndex++;
            usedAnswers = [];
            isQuestionActive = false;
            answerContainer?.classList.add('d-none');
            questionContainer?.classList.add('d-none');
            if (currentQuestionIndex < questions.length) {
                setTimeout(showQuestion, 200);
                questionContainer?.classList.remove('d-none');
                answerContainer?.classList.add('d-none');
                buttoncontainer?.classList.remove('d-none');
                reactionTime?.classList.remove('d-none');
                wimg?.classList.remove('d-none');
                upimg?.classList.remove('d-none');
                feedback?.classList.add('d-none');
            } else {
                setTimeout(() => {
                    localStorage.setItem('player1Score', player1.score.toString());
                    localStorage.setItem('player2Score', player2.score.toString());
                    viszalyData.addScores(player1.score, player2.score);
                    gameContainer?.classList.add('d-none');
                    endMessage?.classList.remove('d-none');
                    let winnerName = player1.score > player2.score ? player1.name : player2.name;
                    const reactionTimeElement = document.getElementById('reactiontime');
                    if (reactionTimeElement) {
                        if (player1.score === player2.score) {
                            reactionTimeElement.innerHTML = `<h2>Döntetlen.</h2>`;
                        }
                        else {
                            reactionTimeElement.innerHTML = `<h2>A győztes: ${winnerName}</h2>`;
                        }
                    }
                }, 2000);            }
        }
        function handleIncorrectAnswer(): void {
            if (!feedback || !currentPlayer) return;
            const message = usedAnswers.includes(answerInput.value.trim().toLowerCase())
                ? 'Ez a válasz már el lett használva!'
                : 'Helytelen! Próbáld újra!';
            feedback.innerHTML = `
                <h2>${message}</h2>
                <h3>${currentPlayer.name}</h3>
            `;
        }
        submitButton?.addEventListener('click', () => checkAnswer(currentPlayer === player1));
        answerInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            checkAnswer(currentPlayer === player1);
        }
    });
    showQuestion();
    } catch (error) {
        console.error("Nem sikerült betölteni a játékot. Hiba:", error);
    }
});

function reactionTime(event: KeyboardEvent): void {
    if (isQuestionActive) return;
    const questionContainer = document.getElementById('question-container');
    const answerContainer = document.getElementById('answer-container');
    const buttoncontainer = document.getElementById('buttoncontainer');
    const reactionTime =  document.getElementById('reactiontime');
    const feedback = document.getElementById('feedback');
    const wimg = document.getElementById('w');
    const upimg = document.getElementById('arrowup');
    if (event.key.toLowerCase() === "w") {
        event.preventDefault();
        isQuestionActive = true;
        currentPlayer = player1;
        isPlayer1Turn = true;
        wimg?.classList.add('d-none');
        upimg?.classList.add('d-none');
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        isQuestionActive = true;
        currentPlayer = player2;
        isPlayer1Turn = false;
        wimg?.classList.add('d-none');
        upimg?.classList.add('d-none');
    }
    if (isQuestionActive) {
        questionContainer?.classList.remove('d-none');
        answerContainer?.classList.remove('d-none');
        buttoncontainer?.classList.remove('d-none');
        reactionTime?.classList.add('d-none');
        answerContainer?.classList.add('d-flex');
        feedback?.classList.remove('d-none');
        showQuestion();
    }
}

document.addEventListener("keydown", reactionTime);

let isQuestionActive = false;
let isPlayer1Turn = true;

const viszalyData = {
    player1TotalScore: 0,
    player2TotalScore: 0,
    addScores(player1Score: number, player2Score: number) {
        this.player1TotalScore += player1Score;
        this.player2TotalScore += player2Score;
        localStorage.setItem('player1TotalScore', this.player1TotalScore.toString());
        localStorage.setItem('player2TotalScore', this.player2TotalScore.toString());
    },
    getPlayer1Score() {
        return this.player1TotalScore;
    },
    getPlayer2Score() {
        return this.player2TotalScore;
    }
};

viszalyData.addScores(Number(localStorage.getItem('viszalyScore')), 0);

console.log('Eredmények:', {
    'Player 1': viszalyData.getPlayer1Score(),
    'Player 2': viszalyData.getPlayer2Score()
});