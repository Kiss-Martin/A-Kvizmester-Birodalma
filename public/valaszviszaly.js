"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let currentPlayer = null;
const player1 = { name: "(W)", score: 0 };
const player2 = { name: "(↑)", score: 0 };
let showQuestion;
function fetchQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3000/valaszok');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            return shuffleArray(data).slice(0, 10);
        }
        catch (error) {
            console.error("Hiba történt a kérdések betöltése során:", error);
            throw error;
        }
    });
}
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
function valaszViszaly() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const questionList = yield fetchQuestions();
            for (const question of questionList) {
                console.log(`Kérdés: ${question.kerdes}`);
                const userAnswer = (_a = prompt("Mi a válaszod?")) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
            }
        }
        catch (error) {
            console.error("Hiba történt a játék során:", error);
        }
    });
}
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const questionContainer = document.getElementById('question-text');
    const answerContainer = document.getElementById('answer-container');
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-button');
    const feedback = document.getElementById('feedback');
    const endMessage = document.getElementById('end-message');
    const gameContainer = document.getElementById('game-container');
    const buttoncontainer = document.getElementById('buttoncontainer');
    const reactionTime = document.getElementById('reactiontime');
    const wimg = document.getElementById('w');
    const upimg = document.getElementById('arrowup');
    let currentQuestionIndex = 0;
    let usedAnswers = [];
    try {
        const questions = yield fetchQuestions();
        showQuestion = () => {
            if (!questionContainer || currentQuestionIndex >= questions.length)
                return;
            answerInput.focus();
            const question = questions[currentQuestionIndex];
            questionContainer.textContent = question.kerdes;
            answerInput.value = '';
            if (feedback && currentPlayer) {
                feedback.innerHTML = `<h3>Jelenlegi játékos: ${currentPlayer.name}</h3>`;
            }
        };
        function checkAnswer(isPlayerOne) {
            currentPlayer = isPlayerOne ? player1 : player2;
            const userAnswer = answerInput.value.trim().toLowerCase();
            const correctAnswers = questions[currentQuestionIndex].valaszok.map(v => v.toLowerCase());
            const answerIndex = correctAnswers.indexOf(userAnswer);
            if (!feedback)
                return;
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
                }
                else {
                    feedback.innerHTML += `<h3>Következő játékos: ${currentPlayer.name}</h3>`;
                }
            }
            else {
                handleIncorrectAnswer();
                isPlayer1Turn = !isPlayer1Turn;
                currentPlayer = isPlayer1Turn ? player1 : player2;
                feedback.innerHTML += `<h3>Következő játékos: ${currentPlayer.name}</h3>`;
            }
            answerInput.value = '';
        }
        function handleNextQuestion() {
            currentQuestionIndex++;
            usedAnswers = [];
            isQuestionActive = false;
            answerContainer === null || answerContainer === void 0 ? void 0 : answerContainer.classList.add('d-none');
            questionContainer === null || questionContainer === void 0 ? void 0 : questionContainer.classList.add('d-none');
            if (currentQuestionIndex < questions.length) {
                setTimeout(showQuestion, 2000);
                questionContainer === null || questionContainer === void 0 ? void 0 : questionContainer.classList.remove('d-none');
                answerContainer === null || answerContainer === void 0 ? void 0 : answerContainer.classList.add('d-none');
                buttoncontainer === null || buttoncontainer === void 0 ? void 0 : buttoncontainer.classList.remove('d-none');
                reactionTime === null || reactionTime === void 0 ? void 0 : reactionTime.classList.remove('d-none');
                wimg === null || wimg === void 0 ? void 0 : wimg.classList.remove('d-none');
                upimg === null || upimg === void 0 ? void 0 : upimg.classList.remove('d-none');
                feedback === null || feedback === void 0 ? void 0 : feedback.classList.add('d-none');
            }
            else {
                setTimeout(() => {
                    gameContainer === null || gameContainer === void 0 ? void 0 : gameContainer.classList.add('d-none');
                    endMessage === null || endMessage === void 0 ? void 0 : endMessage.classList.remove('d-none');
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
                }, 2000);
            }
        }
        function handleIncorrectAnswer() {
            if (!feedback || !currentPlayer)
                return;
            const message = usedAnswers.includes(answerInput.value.trim().toLowerCase())
                ? 'Ez a válasz már el lett használva!'
                : 'Helytelen! Próbáld újra!';
            feedback.innerHTML = `
                <h2>${message}</h2>
                <h3>${currentPlayer.name}</h3>
            `;
        }
        submitButton === null || submitButton === void 0 ? void 0 : submitButton.addEventListener('click', () => checkAnswer(currentPlayer === player1));
        answerInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                checkAnswer(currentPlayer === player1);
            }
        });
        showQuestion();
    }
    catch (error) {
        console.error("Nem sikerült betölteni a játékot. Hiba:", error);
    }
}));
function reactionTime(event) {
    if (isQuestionActive)
        return;
    const questionContainer = document.getElementById('question-container');
    const answerContainer = document.getElementById('answer-container');
    const buttoncontainer = document.getElementById('buttoncontainer');
    const reactionTime = document.getElementById('reactiontime');
    const feedback = document.getElementById('feedback');
    const wimg = document.getElementById('w');
    const upimg = document.getElementById('arrowup');
    if (event.key.toLowerCase() === "w") {
        isQuestionActive = true;
        currentPlayer = player1;
        isPlayer1Turn = true;
    }
    else if (event.key === "ArrowUp") {
        isQuestionActive = true;
        currentPlayer = player2;
        isPlayer1Turn = false;
    }
    wimg === null || wimg === void 0 ? void 0 : wimg.classList.add('d-none');
    upimg === null || upimg === void 0 ? void 0 : upimg.classList.add('d-none');
    if (isQuestionActive) {
        questionContainer === null || questionContainer === void 0 ? void 0 : questionContainer.classList.remove('d-none');
        answerContainer === null || answerContainer === void 0 ? void 0 : answerContainer.classList.remove('d-none');
        buttoncontainer === null || buttoncontainer === void 0 ? void 0 : buttoncontainer.classList.remove('d-none');
        reactionTime === null || reactionTime === void 0 ? void 0 : reactionTime.classList.add('d-none');
        answerContainer === null || answerContainer === void 0 ? void 0 : answerContainer.classList.add('d-flex');
        feedback === null || feedback === void 0 ? void 0 : feedback.classList.remove('d-none');
        showQuestion();
    }
}
document.addEventListener("keydown", reactionTime);
let isQuestionActive = false;
let isPlayer1Turn = true;
const viszalyData = {
    player1TotalScore: 0,
    player2TotalScore: 0,
    addScores(_player1Score, _player2Score) {
        this.player1TotalScore += player1.score;
        this.player2TotalScore += player2.score;
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
