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
    if (flippedCards.length < 2 && !card.matched) {
        cardElement.textContent = card.symbol;
        cardElement.classList.remove("hidden");
        flippedCards.push(card);
    }
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}
function checkMatch() {
    if (flippedCards[0].symbol === flippedCards[1].symbol) {
        flippedCards[0].matched = true;
        flippedCards[1].matched = true;
        matchCount++;
        updateMatchCount();
    }
    else {
        document.querySelectorAll(".card").forEach((cardElement) => {
            const element = cardElement;
            const id = parseInt(element.dataset.id);
            if (!cards[id].matched) {
                element.classList.add("hidden");
                element.textContent = "";
            }
        });
    }
    flippedCards = [];
}
function updateMatchCount() {
    const matchCountDisplay = document.getElementById("match-count");
    matchCountDisplay.textContent = `Egyezések: ${matchCount}`;
}
document.addEventListener("DOMContentLoaded", () => {
    board = document.getElementById("game-board");
    loadCards();
});
