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
const MAX_QUESTIONS = 10;

async function loadCategories() {
    try {
        const response = await fetch('http://localhost:3000/kérdések');
        const allQuestions = await response.json() as Question[];
        const categories = [...new Set(allQuestions.map((q: Question) => q.category)), 'Mind'];
        displayCategoryMenu(categories);
    } catch (error) {
        console.error('Error loading categories:', error);
        showError();
    }
}
function displayCategoryMenu(categories: string[]) {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;
    quizContainer.innerHTML = `
        <div class="card bg-black">
            <div class="card-header">
                <h5 class="card-title text-center">Válassz kategóriát</h5>
            </div>
            <div class="card-body">
                <div class="d-grid gap-2">
                    ${categories.map(category => `
                        <button id="${category}" class="btn btn-warning category-btn" data-category="${category}">
                            ${category}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="text-center text-purple">
                <h3>A legutóbb elért összpontszám: <span class="badge text-bg-secondary" style="background: rgb(255,13,13);
background: linear-gradient(90deg, rgba(255,13,13,1) 0%, rgba(2,212,255,1) 70%);">${quizData.getTotalScore()}</span></h3>
            </div>
        </div>
    `;

    let mind = document.getElementById('Mind');
    mind?.classList.add('gradient');
    mind?.classList.remove('btn-warning');

    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedCategory = (e.target as HTMLButtonElement).dataset.category;
            loadQuestions(selectedCategory);
        });
    });
}
    

    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const selectedCategory = (e.target as HTMLButtonElement).dataset.category;
            loadQuestions(selectedCategory);
        });
    });

async function loadQuestions(selectedCategory: string | undefined) {
    try {
        const response = await fetch('http://localhost:3000/kérdések');
        let allQuestions = await response.json() as Question[];
        
        if (selectedCategory && selectedCategory !== 'Mind') {
            allQuestions = allQuestions.filter((q: Question) => q.category === selectedCategory);
        }
        
        questions = shuffleArray(allQuestions).slice(0, MAX_QUESTIONS);
        displayQuestion();
    } catch (error) {
        console.error('Error loading questions:', error);
        showError();
    }
}
function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length || currentQuestionIndex >= MAX_QUESTIONS) {
        localStorage.setItem('quizScore', currentScore.toString());
        showFinalScore();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    const allAnswers = shuffleArray([question.correct_answer, ...question.incorrect_answers]);
    
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;
    
    console.log(currentScore);
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
                Pontszám: <span class="footerScore">${currentScore}</span> | Kérdés: <span class="footerScore">${currentQuestionIndex + 1}/${MAX_QUESTIONS}</span>
            </div>
        </div>
        <a style="color: white;" href="quiz.html"><button id="reload" type="button" class="btn btn-danger"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
</svg></button></a>
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

// const reloadButton = document.getElementById('reload');
// reloadButton?.addEventListener('click', () => {
//     window.location.reload();
// });


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

const finalScore = localStorage.getItem('quizScore');
const quizData = {
    totalScore: 0,
    addScore(score: number) {
        this.totalScore += score;
    },
    getTotalScore() {
        return this.totalScore;
    }
};

quizData.addScore(Number(localStorage.getItem('quizScore')));

console.log('Quiz Results:', quizData.getTotalScore());

window.addEventListener('load', loadCategories);
