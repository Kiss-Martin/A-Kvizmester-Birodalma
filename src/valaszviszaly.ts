interface Question {
    kerdes: string;
    valaszok: string[];
    pontok?: number[];
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
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-button');
    const feedback = document.getElementById('feedback');
    const endMessage = document.getElementById('end-message');
    const gameContainer = document.getElementById('game-container');
    const questions = await fetchQuestions();
    let currentQuestionIndex = 0;
    let totalScoreW = 0;
    let totalScoreUp = 0;

    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionContainer!.textContent = question.kerdes;
        (answerInput as HTMLInputElement).value = '';
        feedback!.textContent = '';
    }

    let usedAnswers: string[] = [];

    function checkAnswer(ArrowUpOrW: boolean): void {
        const userAnswer = (answerInput as HTMLInputElement).value.trim().toLowerCase();
        const correctAnswers = questions[currentQuestionIndex].valaszok.map(v => v.toLowerCase());
        const answerIndex = correctAnswers.indexOf(userAnswer);

        if (correctAnswers.includes(userAnswer) && !usedAnswers.includes(userAnswer)) {
            usedAnswers.push(userAnswer);
            const points = 5 - answerIndex;
            if (ArrowUpOrW) {
                totalScoreW += Math.max(1, points);
                feedback!.innerHTML = `<h2>Helyes válasz! +${Math.max(1, points)} pont</h2>
                                        <h3>Összpontszám: ${totalScoreW}</h3>`;
            } else {
                totalScoreUp += Math.max(1, points);
                feedback!.innerHTML = `<h2>Helyes válasz! +${Math.max(1, points)} pont</h2>
                                        <h3>Összpontszám: ${totalScoreUp}</h3>`;
            }
            feedback!.classList.add('text-center');

            // Check if all answers have been used
            if (usedAnswers.length === correctAnswers.length) {
                currentQuestionIndex++;
                usedAnswers = []; // Reset used answers
                isQuestionActive = false; // Allow reaction time again
            
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
            feedback!.innerHTML = `<h2>Ez a válasz már el lett használva!</h2>`;
            feedback!.classList.add('text-center');
        } else {
            feedback!.innerHTML = `<h2>Helytelen! Próbáld újra!</h2>`;
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
        let wstyle = document.getElementById("w");
        wstyle!.style.marginTop = "10px";
        setTimeout(() => {
            wstyle!.style.marginTop = "0px";
        }, 200);
        questionContainer!.classList.remove('d-none');
        answerContainer!.classList.remove('d-none');
        return true;
    }
    else if (event.key === "ArrowUp") {
        isQuestionActive = true;
        let arrowupstyle = document.getElementById("arrowup");
        arrowupstyle!.style.marginTop = "10px";
        setTimeout(() => {
            arrowupstyle!.style.marginTop = "0px";
        }, 200);
        questionContainer!.classList.remove('d-none');
        answerContainer!.classList.remove('d-none');
        return false;
    }
}document.addEventListener("keydown", reactionTime);

let isQuestionActive = false;

// let currentPlayer: boolean | null = null; // true for W player, false for ArrowUp player

// function reactionTime(event: KeyboardEvent): boolean | void {
//     if (currentPlayer !== null) return;
    
//     if (event.key === "w" || event.key === "W") {
//         currentPlayer = true;
//         let wstyle = document.getElementById("w");
//         wstyle!.style.marginTop = "10px";
//         setTimeout(() => {
//             wstyle!.style.marginTop = "0px";
//         }, 200);
//         questionContainer!.classList.remove('d-none');
//         answerContainer!.classList.remove('d-none');
//     }
//     else if (event.key === "ArrowUp") {
//         currentPlayer = false;
//         let arrowupstyle = document.getElementById("arrowup");
//         arrowupstyle!.style.marginTop = "10px";
//         setTimeout(() => {
//             arrowupstyle!.style.marginTop = "0px";
//         }, 200);
//         questionContainer!.classList.remove('d-none');
//         answerContainer!.classList.remove('d-none');
//     }
// }

// function checkAnswer(): void {
//     const userAnswer = (answerInput as HTMLInputElement).value.trim().toLowerCase();
//     const correctAnswers = questions[currentQuestionIndex].valaszok.map(v => v.toLowerCase());
//     const answerIndex = correctAnswers.indexOf(userAnswer);

//     if (correctAnswers.includes(userAnswer) && !usedAnswers.includes(userAnswer)) {
//         usedAnswers.push(userAnswer);
//         const points = 5 - answerIndex;
        
//         if (currentPlayer) {
//             totalScoreW += Math.max(1, points);
//             feedback!.innerHTML = `<h2>Helyes válasz! +${Math.max(1, points)} pont</h2>
//                                     <h3>W játékos összpontszáma: ${totalScoreW}</h3>`;
//         } else {
//             totalScoreUp += Math.max(1, points);
//             feedback!.innerHTML = `<h2>Helyes válasz! +${Math.max(1, points)} pont</h2>
//                                     <h3>ArrowUp játékos összpontszáma: ${totalScoreUp}</h3>`;
//         }
        
//         // Switch players after correct answer
//         currentPlayer = !currentPlayer;
        
//         if (usedAnswers.length === correctAnswers.length) {
//             currentQuestionIndex++;
//             usedAnswers = [];
//             currentPlayer = null; // Reset for next reaction time competition
            
//             if (currentQuestionIndex < questions.length) {
//                 setTimeout(showQuestion, 2000);
//             } else {
//                 setTimeout(() => {
//                     gameContainer!.classList.add('d-none');
//                     endMessage!.classList.remove('d-none');
//                 }, 2000);
//             }
//         }
//     } else if (usedAnswers.includes(userAnswer)) {
//         feedback!.innerHTML = `<h2>Ez a válasz már el lett használva!</h2>`;
//     } else {
//         feedback!.innerHTML = `<h2>Helytelen! A másik játékos következik!</h2>`;
//         currentPlayer = !currentPlayer; // Switch players after wrong answer
//     }
    
//     (answerInput as HTMLInputElement).value = '';
// }
