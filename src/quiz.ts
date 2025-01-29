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
      <div class="card">
          <div class="card-header d-flex justify-content-between">
              <span class="badge bg-primary">${question.category}</span>
              <span class="badge bg-secondary">${question.difficulty}</span>
          </div>
          <div class="card-body">
              <h5 class="card-title mb-4">${question.question}</h5>
              <div class="d-grid gap-2">
                  ${allAnswers.map(answer => `
                      <button class="btn btn-outline-primary answer-btn" data-answer="${answer}">
                          ${answer}
                      </button>
                  `).join('')}
              </div>
          </div>
          <div class="card-footer text-muted">
              Pontszám: ${currentScore} | Kérdés: ${currentQuestionIndex + 1}/${questions.length}
          </div>
      </div>
  `;

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
      <div class="card text-center">
          <div class="card-body">
              <h5 class="card-title">Játék vége!</h5>
              <p class="card-text">Végső pontszám: ${currentScore}</p>
              <button class="btn btn-primary" onclick="location.reload()">Újra játszás</button>
              <a href="index.html" class="btn btn-secondary">Főoldal</a>
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

