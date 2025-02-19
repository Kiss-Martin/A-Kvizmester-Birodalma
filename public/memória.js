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
let cards = [];
let flippedCards = [];
let board;
let matchCount = 0;
let totalPairs = 0;
function loadCards() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("memória.json");
        if (!response.ok) {
            throw new Error("Hiba van");
        }
        const data = yield response.json();
        const symbols = data.cards.map((card) => card.symbol).sort(() => Math.random() - 0.5);
        cards = symbols.map((symbol, index) => ({
            id: index,
            symbol: symbol,
            matched: false
        }));
        totalPairs = cards.length / 2;
        alert("Üdvözöljük, ha kártyafordításnál hibába ütközik nuygodtan használja az - Új játék - gombot!");
        renderBoard();
    });
}
function renderBoard() {
    board.innerHTML = "";
    cards.forEach((card) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card", "hidden");
        cardElement.dataset.id = card.id.toString();
        cardElement.addEventListener("click", () => flipCard(card, cardElement));
        board.appendChild(cardElement);
    });
}
function flipCard(card, cardElement) {
    if (flippedCards.length < 2 && !card.matched && !flippedCards.includes(card)) {
        cardElement.textContent = card.symbol;
        cardElement.classList.remove("hidden");
        flippedCards.push(card);
    }
    if (flippedCards.length === 2) {
        setTimeout(checkMatch);
    }
}
function checkMatch() {
    if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;
        if (card1.symbol === card2.symbol) {
            card1.matched = true;
            card2.matched = true;
            matchCount++;
            updateMatchCount();
            if (matchCount === totalPairs) {
                setTimeout(() => {
                    alert("Gratulálunk, nyertél!");
                    window.location.reload();
                }, 500);
            }
        }
        else {
            setTimeout(() => {
                document.querySelectorAll(".card").forEach((cardElement) => {
                    const element = cardElement;
                    const id = parseInt(element.dataset.id);
                    if (!cards[id].matched) {
                        element.classList.add("hidden");
                        element.textContent = "";
                    }
                });
            }, 500);
        }
        flippedCards = [];
    }
}
function updateMatchCount() {
    const matchCountDisplay = document.getElementById("match-count");
    matchCountDisplay.textContent = `Egyezések: ${matchCount}`;
}
function restartGame() {
    matchCount = 0;
    flippedCards = [];
    loadCards();
    updateMatchCount();
    document.querySelectorAll(".card").forEach((cardElement) => {
        const element = cardElement;
        element.classList.add("hidden");
        element.textContent = "";
    });
}
document.addEventListener("DOMContentLoaded", () => {
    board = document.getElementById("game-board");
    loadCards();
    const restartButton = document.createElement("button");
    restartButton.textContent = "Új játék";
    restartButton.style.marginTop = "10px";
    restartButton.addEventListener("click", restartGame);
    document.body.appendChild(restartButton);
});
