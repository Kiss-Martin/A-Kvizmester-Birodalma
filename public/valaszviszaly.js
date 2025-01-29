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
            const response = yield fetch('http://localhost:3000/valaszok');
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
        console.log("Üdvözöllek a Family Feud játékban!");
        try {
            const questionList = yield fetchQuestions();
            for (const question of questionList) {
                console.log(`Kérdés: ${question.kerdes}`);
                const userAnswer = (_a = prompt("Mi a válaszod?")) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
                if (userAnswer && question.valaszok.map(str => str.toLowerCase()).includes(userAnswer)) {
                    console.log("Helyes válasz!");
                }
                else {
                    console.log(`Helytelen! A helyes válasz: ${question.valaszok.join(', ')}`);
                }
            }
            console.log("A játék véget ért! Köszönöm, hogy játszottál!");
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
    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionContainer.textContent = question.kerdes;
        answerInput.value = '';
        feedback.textContent = '';
    }
    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        const correctAnswers = questions[currentQuestionIndex].valaszok.map(v => v.toLowerCase());
        if (correctAnswers.includes(userAnswer)) {
            feedback.textContent = "Helyes válasz!";
            feedback.className = "text-success";
        }
        else {
            feedback.textContent = `Helytelen! A helyes válaszok: ${questions[currentQuestionIndex].valaszok.join(', ')}`;
            feedback.className = "text-danger";
        }
        currentQuestionIndex++;
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
    submitButton.addEventListener('click', checkAnswer);
    showQuestion();
}));
