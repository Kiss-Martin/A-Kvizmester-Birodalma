interface Ko {
    id: number;
    name: string;
}

let playerWins = 0;
let computerWins = 0;

async function fetchChoices(): Promise<{ choices: Ko[] }> {
    const response = await fetch('http://localhost:3000/choices');
    if (!response.ok) {
        throw new Error("Hiba van");
    }
    const data = await response.json();
    console.log("Data:", data); 
    return data; 
}


async function getRandomChoice(): Promise<string> {
    const data = await fetchChoices();
    console.log("Data:", data); 
    if (Array.isArray(data)) { 
        const choices = data.map(item => item.name); 
        return choices[Math.floor(Math.random() * choices.length)];
    } else {
        throw new Error("Hiba");
    }
}


async function playGame(playerChoice: string): Promise<void> {
    const opponentChoice = await getRandomChoice();
    const resultElement = document.getElementById("result");
    const scoreElement = document.getElementById("score");
    
    if (!resultElement) return;
    
    resultElement.innerHTML = `Te választottad: ${playerChoice}<br>Ellenfél választása: ${opponentChoice}`;

    if (playerChoice === opponentChoice) {
        resultElement.innerHTML += "<br>Döntetlen!";
    } else if (
        (playerChoice === "kő" && opponentChoice === "olló") ||
        (playerChoice === "papír" && opponentChoice === "kő") ||
        (playerChoice === "olló" && opponentChoice === "papír")
    ) {
        resultElement.innerHTML += "<br>Nyertél!";
        playerWins++;
    } else {
        resultElement.innerHTML += "<br>Vesztettél!";
        computerWins++;
    }
    const gameScore = calculateRPSScore(playerWins, computerWins);
    scoreElement!.innerHTML = `Te: ${playerWins} | Gép: ${computerWins}`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => playGame(button.id));
    });
});

function calculateRPSScore(playerWins: number, computerWins: number): number {
    // Win = 100 points, Loss = -50 points
    return (playerWins * 100) - (computerWins * 50);
}
