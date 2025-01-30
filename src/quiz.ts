interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  difficulty: string;
}

let currentScore = 0;
let currentQuestionIndex = 0;
let questions: Question[] = [];


async function loadQuestions() {
  try {
      const response = await fetch('http://localhost:3000/kérdések');
      questions = await response.json();
      displayQuestion();
  } catch (error) {
      console.error('Error loading questions:', error);
      showError();
  }
}

function shuffleArray(array: string[]): string[] {
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
  if (!quizContainer) return;

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
    if (question.difficulty === 'Könnyű'){
      difficulty.classList.add("text-bg-success");
    } else if (question.difficulty === 'Közepes'){
      difficulty.classList.add("text-bg-warning");
    } else {
      difficulty.classList.add("text-bg-danger");
    }
  }

  document.querySelectorAll('.answer-btn').forEach(button => {
      button.addEventListener('click', handleAnswer);
  });
}
function handleAnswer(event: Event) {
  const button = event.target as HTMLButtonElement;
  const selectedAnswer = button.dataset.answer;
  const currentQuestion = questions[currentQuestionIndex];

  if (selectedAnswer === currentQuestion.correct_answer) {
      currentScore += 10;
      button.classList.add('btn-success');
  } else {
      button.classList.add('btn-danger');
  }

  document.querySelectorAll('.answer-btn').forEach(btn => {
      btn.setAttribute('disabled', 'true');
      if ((btn as HTMLButtonElement).dataset.answer === currentQuestion.correct_answer) {
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
  if (!quizContainer) return;

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
