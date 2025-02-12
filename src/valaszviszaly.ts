interface Question {
    kerdes: string;
    valaszok: string[];
    pontok?: number[];
}
interface Player {
    name: string;
    score: number;
}

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
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-button');
    const feedback = document.getElementById('feedback');
    const endMessage = document.getElementById('end-message');
    const gameContainer = document.getElementById('game-container');
    const questions = await fetchQuestions();
    let currentQuestionIndex = 0;
    let totalScoreW = 0;
    let totalScoreUp = 0;
    const player1: Player = { name: "Player 1 (W)", score: 0 };
    const player2: Player = { name: "Player 2 (↑)", score: 0 };
    let currentPlayer: Player | null = null;

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionContainer!.textContent = question.kerdes;
        (answerInput as HTMLInputElement).value = '';
        feedback!.textContent = '';
        feedback!.innerHTML = `<h3>Current player: ${currentPlayer?.name}</h3>`;
    }

    let usedAnswers: string[] = [];

    function checkAnswer(ArrowUpOrW: boolean): void {
        currentPlayer = ArrowUpOrW ? player1 : player2;
        const userAnswer = (answerInput as HTMLInputElement).value.trim().toLowerCase();
        const correctAnswers = questions[currentQuestionIndex].valaszok.map(v => v.toLowerCase());
        const answerIndex = correctAnswers.indexOf(userAnswer);

        if (correctAnswers.includes(userAnswer) && !usedAnswers.includes(userAnswer)) {
            usedAnswers.push(userAnswer);
            const points = 5 - answerIndex;
            currentPlayer.score += Math.max(1, points);
            feedback!.innerHTML = `
                <h2>Helyes válasz! +${Math.max(1, points)} pont</h2>
                <h3>${currentPlayer.name}: ${currentPlayer.score} pont</h3>`;
            feedback!.classList.add('text-center');

            // Check if all answers have been used
            if (usedAnswers.length === correctAnswers.length) {
                currentQuestionIndex++;
                usedAnswers = []; // Reset used answers
                isQuestionActive = false; // Allow reaction time again
                questionContainer!.classList.add('d-none');
                answerContainer!.classList.add('d-none');
                if (currentQuestionIndex < questions.length) {
                    setTimeout(showQuestion, 2000);
                } else {
                    setTimeout(() => {
                        gameContainer!.classList.add('d-none');
                        endMessage!.classList.remove('d-none');
                    }, 2000);
                }
            }
        } else if (usedAnswers.includes(userAnswer)) {
            feedback!.innerHTML = `
                <h2>Ez a válasz már el lett használva!</h2>
                <h3>${currentPlayer.name}</h3>
            `;
            feedback!.classList.add('text-center');
        } else {
            feedback!.innerHTML = `
                <h2>Helytelen! Próbáld újra!</h2>
                <h3>${currentPlayer.name}</h3>
            `;
            feedback!.classList.add('text-center');
        }
        (answerInput as HTMLInputElement).value = '';
    }
    submitButton!.addEventListener('click', () => checkAnswer(true));
    showQuestion();
});

function reactionTime(event: KeyboardEvent): boolean | void {
    if (isQuestionActive) return;
    const questionContainer = document.getElementById('question-container');
    const answerContainer = document.getElementById('answer-container');
    
    if (event.key === "w" || event.key === "W") {
        isQuestionActive = true;
        currentPlayer = player1;
        let wstyle = document.getElementById("w");
        wstyle!.style.marginTop = "10px";
        setTimeout(() => {
            wstyle!.style.marginTop = "0px";
        }, 200);
        questionContainer!.classList.remove('d-none');
        answerContainer!.classList.remove('d-none');
        showQuestion();
        return true;
    }
    else if (event.key === "ArrowUp") {
        isQuestionActive = true;
        currentPlayer = player2;
        let arrowupstyle = document.getElementById("arrowup");
        arrowupstyle!.style.marginTop = "10px";
        setTimeout(() => {
            arrowupstyle!.style.marginTop = "0px";
        }, 200);
        questionContainer!.classList.remove('d-none');
        answerContainer!.classList.remove('d-none');
        showQuestion();
        return false;
    }
} document.addEventListener("keydown", reactionTime);

let isQuestionActive = false;