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
let matchCount = 0;
let boardLocked = false;
const gameBoard = document.getElementById('game-board');
const matchCountElement = document.getElementById('match-count');
function fetchcards() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("http://localhost:3000/cards");
        if (!response.ok) {
            throw new Error("Hiba van");
        }
        else {
            const data = yield response.json();
            console.log("Fetched cards:", data);
            return data;
        }
    });
}
function setupGame() {
    return __awaiter(this, void 0, void 0, function* () {
        cards = yield fetchcards();
        console.log("Cards array after setup:", cards);
        const shuffledCards = shuffle(cards);
        gameBoard.innerHTML = '';
        shuffledCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card', 'hidden');
            cardElement.setAttribute('data-index', index.toString());
            cardElement.addEventListener('click', handleCardClick);
            gameBoard.appendChild(cardElement);
        });
    });
}
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
function handleCardClick(event) {
    const cardElement = event.target;
    if (cardElement.classList.contains('flipped') || boardLocked) {
        return;
    }
    const cardIndex = cardElement.getAttribute('data-index');
    if (cardIndex === null)
        return;
    const card = cards[parseInt(cardIndex)];
    if (!card) {
        console.error(`Card at index ${cardIndex} is undefined!`);
        return;
    }
    console.log(`Card clicked:`, card);
    cardElement.textContent = card.symbol;
    cardElement.classList.remove('hidden');
    cardElement.classList.add('flipped');
    flippedCards.push(cardElement);
    if (flippedCards.length === 2) {
        boardLocked = true;
        checkMatch();
    }
}
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    const firstSymbol = firstCard.textContent;
    const secondSymbol = secondCard.textContent;
    if (firstSymbol === secondSymbol) {
        flippedCards = [];
        boardLocked = false;
        updateMatchCount();
    }
    else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.textContent = '';
            secondCard.textContent = '';
            firstCard.classList.add('hidden');
            secondCard.classList.add('hidden');
            flippedCards = [];
            boardLocked = false;
        }, 1000);
    }
}
function updateMatchCount() {
    matchCount++;
    matchCountElement.textContent = `Egyezések: ${matchCount}`;
}
function restartGame() {
    matchCount = 0;
    flippedCards = [];
    boardLocked = false;
    setupGame();
    matchCountElement.textContent = `Egyezések: ${matchCount}`;
}
setupGame();
let memoryScore = 0;
function updateScore(matches) {
    memoryScore = matches * 100; // 100 points per match
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Pontszám: ${memoryScore}`;
    }
}
function calculateMemoryScore(matches, attempts) {
    // Base score: matches * 100, minus penalty for attempts
    return (matches * 100) - ((attempts - matches) * 20);
}
