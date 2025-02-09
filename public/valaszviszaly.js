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
function fetchQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3002/valaszok');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("Hiba történt a kérdések betöltése során:", error);
            throw error;
        }
    });
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
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-button');
    const feedback = document.getElementById('feedback');
    const endMessage = document.getElementById('end-message');
    const gameContainer = document.getElementById('game-container');
    const questions = yield fetchQuestions();
    let currentQuestionIndex = 0;
    let totalScoreW = 0;
    let totalScoreUp = 0;
    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionContainer.textContent = question.kerdes;
        answerInput.value = '';
        feedback.textContent = '';
    }
    let usedAnswers = [];
    function checkAnswer(ArrowUpOrW) {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswers = questions[currentQuestionIndex].valaszok.map(v => v.toLowerCase());
        const answerIndex = correctAnswers.indexOf(userAnswer);
        if (correctAnswers.includes(userAnswer) && !usedAnswers.includes(userAnswer)) {
            usedAnswers.push(userAnswer);
            const points = 5 - answerIndex;
            if (ArrowUpOrW) {
                totalScoreW += Math.max(1, points);
                feedback.innerHTML = `<h2>Helyes válasz! +${Math.max(1, points)} pont</h2>
                                        <h3>Összpontszám: ${totalScoreW}</h3>`;
            }
            else {
                totalScoreUp += Math.max(1, points);
                feedback.innerHTML = `<h2>Helyes válasz! +${Math.max(1, points)} pont</h2>
                                        <h3>Összpontszám: ${totalScoreUp}</h3>`;
            }
            feedback.classList.add('text-center');
            // Check if all answers have been used
            if (usedAnswers.length === correctAnswers.length) {
                currentQuestionIndex++;
                usedAnswers = []; // Reset used answers
                isQuestionActive = false; // Allow reaction time again
                if (currentQuestionIndex < questions.length) {
                    setTimeout(showQuestion, 2000);
                }
                else {
                    setTimeout(() => {
                        gameContainer.classList.add('d-none');
                        endMessage.classList.remove('d-none');
                    }, 2000);
                }
            }
        }
        else if (usedAnswers.includes(userAnswer)) {
            feedback.innerHTML = `<h2>Ez a válasz már el lett használva!</h2>`;
            feedback.classList.add('text-center');
        }
        else {
            feedback.innerHTML = `<h2>Helytelen! Próbáld újra!</h2>`;
            feedback.classList.add('text-center');
        }
        answerInput.value = '';
    }
    submitButton.addEventListener('click', () => checkAnswer(true));
    showQuestion();
}));
function reactionTime(event) {
    if (isQuestionActive)
        return;
    const questionContainer = document.getElementById('question-container');
    const answerContainer = document.getElementById('answer-container');
    if (event.key === "w" || event.key === "W") {
        isQuestionActive = true;
        let wstyle = document.getElementById("w");
        wstyle.style.marginTop = "10px";
        setTimeout(() => {
            wstyle.style.marginTop = "0px";
        }, 200);
        questionContainer.classList.remove('d-none');
        answerContainer.classList.remove('d-none');
        return true;
    }
    else if (event.key === "ArrowUp") {
        isQuestionActive = true;
        let arrowupstyle = document.getElementById("arrowup");
        arrowupstyle.style.marginTop = "10px";
        setTimeout(() => {
            arrowupstyle.style.marginTop = "0px";
        }, 200);
        questionContainer.classList.remove('d-none');
        answerContainer.classList.remove('d-none');
        return false;
    }
}
document.addEventListener("keydown", reactionTime);
let isQuestionActive = false;
