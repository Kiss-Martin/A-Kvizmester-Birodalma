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
let currentScore = 0;
let currentQuestionIndex = 0;
let questions = [];
function loadQuestions() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('http://localhost:3000/kérdések');
            questions = yield response.json();
            displayQuestion();
        }
        catch (error) {
            console.error('Error loading questions:', error);
            showError();
        }
    });
}
function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}
function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        localStorage.setItem('quizScore', currentScore.toString());
        showFinalScore();
        return;
    }
    const question = questions[currentQuestionIndex];
    const allAnswers = shuffleArray([question.correct_answer, ...question.incorrect_answers]);
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer)
        return;
    quizContainer.innerHTML = `
      
      <div class="card bg-black">
          <div class="bg-dark card-header d-flex justify-content-between">
              <span class="badge text-bg-light">${question.category}</span>
              <span id='difficulty' class="badge">${question.difficulty}</span>
          </div>
          <div class="card-body">
              <h5 class="card-title mb-4">${question.question}</h5>
              <div class="d-grid gap-2">
                  ${allAnswers.map(answer => `
                      <button class="btn btn-outline-warning answer-btn" data-answer="${answer}">
                          <b>${answer}</b>
                      </button>
                  `).join('')}
              </div>
          </div>
          <div class="card-footer">
              Pontszám: <span class="footerScore">${currentScore}</span> | Kérdés: <span class="footerScore">${currentQuestionIndex + 1}/${questions.length}</span>
          </div>
      </div>
  `;
    let difficulty = document.getElementById('difficulty');
    if (difficulty) {
        if (question.difficulty === 'Könnyű') {
            difficulty.classList.add("text-bg-success");
        }
        else if (question.difficulty === 'Közepes') {
            difficulty.classList.add("text-bg-warning");
        }
        else {
            difficulty.classList.add("text-bg-danger");
        }
    }
    document.querySelectorAll('.answer-btn').forEach(button => {
        button.addEventListener('click', handleAnswer);
    });
}
function handleAnswer(event) {
    const button = event.target;
    const selectedAnswer = button.dataset.answer;
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correct_answer) {
        currentScore += 10;
        button.classList.add('btn-success');
    }
    else {
        button.classList.add('btn-danger');
    }
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.setAttribute('disabled', 'true');
        if (btn.dataset.answer === currentQuestion.correct_answer) {
            btn.classList.add('btn-success');
        }
    });
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1500);
}
function showFinalScore() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer)
        return;
    quizContainer.innerHTML = `
      <div class="card bg-black text-center">
          <div class="card-body">
              <h5 class="card-title">Játék vége!</h5>
              <p class="card-footer">Végső pontszám: <span class="footerScore">${currentScore}</span></p>
              <button class="btn btn-success" onclick="location.reload()">Újrajátszás</button>
              <a href="index.html" class="btn btn-secondary">Főoldal</a>
              <a href="menü.html" class="btn btn-secondary">Menü</a>
          </div>
      </div>
  `;
}
function showError() {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.classList.remove('d-none');
    }
}
window.addEventListener('load', loadQuestions);
