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
let playerWins = 0;
let computerWins = 0;
function fetchChoices() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("http://localhost:3000/choices");
        if (!response.ok) {
            throw new Error("Hiba van");
        }
        const data = yield response.json();
        console.log("Data:", data);
        return data;
    });
}
function getRandomChoice() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetchChoices();
        console.log("Data:", data);
        if (Array.isArray(data)) {
            const choices = data.map(item => item.name);
            return choices[Math.floor(Math.random() * choices.length)];
        }
        else {
            throw new Error("Hiba");
        }
    });
}
function playGame(playerChoice) {
    return __awaiter(this, void 0, void 0, function* () {
        const opponentChoice = yield getRandomChoice();
        const resultElement = document.getElementById("result");
        const scoreElement = document.getElementById("score");
        if (!resultElement)
            return;
        resultElement.innerHTML = `Te választottad: ${playerChoice}<br>Ellenfél választása: ${opponentChoice}`;
        if (playerChoice === opponentChoice) {
            resultElement.innerHTML += "<br>Döntetlen!";
        }
        else if ((playerChoice === "kő" && opponentChoice === "olló") ||
            (playerChoice === "papír" && opponentChoice === "kő") ||
            (playerChoice === "olló" && opponentChoice === "papír")) {
            resultElement.innerHTML += "<br>Nyertél!";
            playerWins++;
        }
        else {
            resultElement.innerHTML += "<br>Vesztettél!";
            computerWins++;
        }
        scoreElement.innerHTML = `Te: ${playerWins} | Gép: ${computerWins}`;
    });
}
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => playGame(button.id));
    });
});
