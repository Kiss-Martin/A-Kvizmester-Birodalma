interface Card {
    symbol: string;
}

interface GameCard {
    id: number;
    symbol: string;
    matched: boolean;
}

let cards: GameCard[] = [];
let flippedCards: GameCard[] = [];
let board: HTMLElement;
let matchCount: number = 0;

    async function loadCards() {
        const response = await fetch("memória.json");
        if (!response.ok) {
            throw new Error("Hiba van")
        }
        const data = await response.json();


    const symbols: string[] = data.cards.map((card: Card) => card.symbol).sort(() => Math.random() - 0.5);


    cards = symbols.map((symbol, index) => ({
        id: index,
        symbol: symbol,
        matched: false
    }));

    renderBoard();
}

function renderBoard() {
    board.innerHTML = "";
    cards.forEach((card) => {
        const cardElement = document.createElement("div") as HTMLElement;
        cardElement.classList.add("card", "hidden");
        cardElement.dataset.id = card.id.toString();
        cardElement.addEventListener("click", () => flipCard(card, cardElement));
        board.appendChild(cardElement);
    });
}

function flipCard(card: GameCard, cardElement: HTMLElement) {
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
    } else {
        document.querySelectorAll(".card").forEach((cardElement) => {
            const element = cardElement as HTMLElement;
            const id = parseInt(element.dataset.id as string);
            if (!cards[id].matched) {
                element.classList.add("hidden");
                element.textContent = "";
            }
        });
    }
    flippedCards = [];
}

function updateMatchCount() {
    const matchCountDisplay = document.getElementById("match-count")!;
    matchCountDisplay.textContent = `Egyezések: ${matchCount}`;
}

document.addEventListener("DOMContentLoaded", () => {
    board = document.getElementById("game-board")!;
    loadCards();
});
