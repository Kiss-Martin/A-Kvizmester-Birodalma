"use strict";
const gameContainer = document.getElementById("game-container");
const messageDiv = document.getElementById("message");
let sequence = [];
let playerSequence = [];
let clickable = false;
for (let i = 0; i < 9; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = i.toString();
    gameContainer.appendChild(card);
    card.addEventListener("click", () => handleCardClickk(i));
}
startGame();
function startGame() {
    sequence = [];
    playerSequence = [];
    clickable = false;
    messageDiv.classList.add("hidden");
    const allCards = document.querySelectorAll(".card");
    allCards.forEach((card) => card.classList.remove("highlight"));
    generateSequence();
}
function generateSequence() {
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * 9);
        sequence.push(randomIndex);
    }
    showSequence();
}
function showSequence() {
    let delay = 500;
    sequence.forEach((index, i) => {
        setTimeout(() => {
            highlightCard(index);
            setTimeout(() => unhighlightCard(index), 400);
            if (i === sequence.length - 1) {
                setTimeout(() => {
                    clickable = true;
                }, 500);
            }
        }, i * delay);
    });
}
function handleCardClickk(index) {
    console.log("handleCardClick called with index:", index);
    if (!clickable)
        return;
    playerSequence.push(index);
    highlightCard(index);
    setTimeout(() => unhighlightCard(index), 400);
    if (playerSequence.length === sequence.length) {
        checkResult();
    }
}
function checkResult() {
    clickable = false;
    if (JSON.stringify(sequence) === JSON.stringify(playerSequence)) {
        showMessage("Gratulálunk! 🎉", "green");
    }
    else {
        showMessage("Hibáztál! ❌", "red");
    }
}
function highlightCard(index) {
    const card = document.querySelector(`.card[data-index="${index}"]`);
    if (card) {
        card.classList.add("highlight");
    }
}
function unhighlightCard(index) {
    const card = document.querySelector(`.card[data-index="${index}"]`);
    if (card) {
        card.classList.remove("highlight");
    }
}
function showMessage(text, color) {
    messageDiv.textContent = text;
    messageDiv.style.color = color;
    messageDiv.classList.remove("hidden");
    setTimeout(() => {
        startGame();
    }, 2000);
}
