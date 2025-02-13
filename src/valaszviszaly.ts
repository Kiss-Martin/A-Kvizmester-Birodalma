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
        const response = await fetch('http://localhost:3002/valaszok');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Question[] = await response.json();
        return data;
    } catch (error) {
        console.error("Hiba történt a kérdések betöltése során:", error);
        throw error;
    }
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
    const questionContainer = document.getElementById('question-text');
    const answerContainer = document.getElementById('answer-container');
    const answerInput = document.getElementById('answer-input') as HTMLInputElement;
    const submitButton = document.getElementById('submit-button');
    const feedback = document.getElementById('feedback');
    const endMessage = document.getElementById('end-message');
    const gameContainer = document.getElementById('game-container');
    
    let currentQuestionIndex = 0;
    let usedAnswers: string[] = [];
    
    try {
        const questions = await fetchQuestions();
        
        showQuestion = () => {
            if (!questionContainer || currentQuestionIndex >= questions.length) return;
            
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
        
                // Switch turns
                isPlayer1Turn = !isPlayer1Turn;
                currentPlayer = isPlayer1Turn ? player1 : player2;
                
                if (usedAnswers.length === correctAnswers.length) {
                    handleNextQuestion();
                } else {
                    // Show whose turn is next
                    feedback.innerHTML += `<h3>Következő játékos: ${currentPlayer.name}</h3>`;
                }
            } else {
                handleIncorrectAnswer();
                // Switch turns even on wrong answer
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
                setTimeout(showQuestion, 2000);
                questionContainer?.classList.remove('d-none');
            } else {
                setTimeout(() => {
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
        showQuestion();
        
    } catch (error) {
        console.error("Nem sikerült betölteni a játékot. Hiba:", error);
    }
});


function reactionTime(event: KeyboardEvent): void {
    if (isQuestionActive) return;
    const questionContainer = document.getElementById('question-container');
    const answerContainer = document.getElementById('answer-container');
    
    if (event.key.toLowerCase() === "w") {
        isQuestionActive = true;
        currentPlayer = player1;
        isPlayer1Turn = true;
        const wstyle = document.getElementById("w");
        if (wstyle) {
            wstyle.style.marginTop = "10px";
            setTimeout(() => {
                wstyle.style.marginTop = "0px";
            }, 200);
        }
    } else if (event.key === "ArrowUp") {
        isQuestionActive = true;
        currentPlayer = player2;
        isPlayer1Turn = false;
        const arrowupstyle = document.getElementById("arrowup");
        if (arrowupstyle) {
            arrowupstyle.style.marginTop = "10px";
            setTimeout(() => {
                arrowupstyle.style.marginTop = "0px";
            }, 200);
        }
    }

    if (isQuestionActive) {
        questionContainer?.classList.remove('d-none');
        answerContainer?.classList.remove('d-none');
        showQuestion();
    }
}

 document.addEventListener("keydown", reactionTime);

let isQuestionActive = false;

let isPlayer1Turn = true;
