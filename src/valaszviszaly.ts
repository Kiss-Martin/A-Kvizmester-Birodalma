interface Question {
    kerdes: string;
    valaszok: string[];
}

async function fetchQuestions(): Promise<Question[]> {
    try {
        const response = await fetch('http://localhost:3000/valaszok');
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
    console.log("Üdvözöllek a Family Feud játékban!");
    try {
        const questionList = await fetchQuestions();
        for (const question of questionList) {
            console.log(`Kérdés: ${question.kerdes}`);
            const userAnswer = prompt("Mi a válaszod?")?.trim().toLowerCase();
            if (userAnswer && question.valaszok.map(str => str.toLowerCase()).includes(userAnswer)) {
                console.log("Helyes válasz!");
            } else {
                console.log(`Helytelen! A helyes válasz: ${question.valaszok.join(', ')}`);
            }
        }
        console.log("A játék véget ért! Köszönöm, hogy játszottál!");
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
    function showQuestion() {
        const question = questions[currentQuestionIndex];
        questionContainer!.textContent = question.kerdes;
        (answerInput as HTMLInputElement).value = '';
        feedback!.textContent = '';
    }
    function checkAnswer() {
        const userAnswer = (answerInput as HTMLInputElement).value.trim().toLowerCase();
        const correctAnswers = questions[currentQuestionIndex].valaszok.map(v => v.toLowerCase());
        if (correctAnswers.includes(userAnswer)) {
            feedback!.textContent = "Helyes válasz!";
            feedback!.className = "text-success";
        } else {
            feedback!.textContent = `Helytelen! A helyes válaszok: ${questions[currentQuestionIndex].valaszok.join(', ')}`;
            feedback!.className = "text-danger";
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setTimeout(showQuestion, 2000);
        } else {
            setTimeout(() => {
                gameContainer!.classList.add('d-none');
                endMessage!.classList.remove('d-none');
            }, 2000);
        }
    }
    submitButton!.addEventListener('click', checkAnswer);
    showQuestion();
});

function reactionTime(event : KeyboardEvent) {
    let w : number | null = null;
    let arrowup : number | null = null;
    const start = Date.now();
    if (event.key === "w" || event.key === "W") {
        let wstyle = document.getElementById("w");
        wstyle!.style.marginTop = "10px";
        setInterval(() => {
            wstyle!.style.marginTop = "0px";
        }, 100);
        if (w === null) {
            w = start;
        }
    }
    if (event.key === "ArrowUp") {
        let arrowupstyle = document.getElementById("arrowup");
        arrowupstyle!.style.marginTop = "10px";
        setInterval(() => {
            arrowupstyle!.style.marginTop = "0px";
        }, 100);
        if (arrowup === null) {
            arrowup = start;
        }
    }
    if (w && arrowup) {
        if (w < arrowup) {
            console.log("w was pressed before arrowup");
        }
        else if (w > arrowup) {
            console.log("arrowup was pressed before w");
        }
        else {
            console.log("w and arrowup were pressed at the same time");
        }
        w = null;
        arrowup = null;
    }
}
document.addEventListener("keydown", reactionTime);