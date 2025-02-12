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
let totalPairs: number = 0;

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

    totalPairs = cards.length / 2; 

    alert("Üdvözöljük, ha kártyafordításnál hibába ütközik nuygodtan használja az - Új játék - gombot!");

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
        } else {
            setTimeout(() => {
                document.querySelectorAll(".card").forEach((cardElement) => {
                    const element = cardElement as HTMLElement;
                    const id = parseInt(element.dataset.id as string);
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
    const matchCountDisplay = document.getElementById("match-count")!;
    matchCountDisplay.textContent = `Egyezések: ${matchCount}`;
}


function restartGame() {
    matchCount = 0;
    flippedCards = [];
    loadCards(); 
    updateMatchCount();
    document.querySelectorAll(".card").forEach((cardElement) => {
        const element = cardElement as HTMLElement;
        element.classList.add("hidden");
        element.textContent = "";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    board = document.getElementById("game-board")!;
    loadCards();


    const restartButton = document.createElement("button");
    restartButton.textContent = "Új játék";
    restartButton.style.marginTop = "10px"
    restartButton.addEventListener("click", restartGame);
    document.body.appendChild(restartButton);
});
