
const cards = [
    { symbol: "🍎" },
    { symbol: "🍎" },
    { symbol: "🍌" },
    { symbol: "🍌" },
    { symbol: "🍇" },
    { symbol: "🍇" },
    { symbol: "🍒" },
    { symbol: "🍒" },
    { symbol: "🌭" },
    { symbol: "🌭" },
    { symbol: "🍓" },
    { symbol: "🍓" },
    { symbol: "🍑" },
    { symbol: "🍑" },
    { symbol: "🍉" },
    { symbol: "🍉" },
    { symbol: "🥔" },
    { symbol: "🥔" },
    { symbol: "🍍" },
    { symbol: "🍍" },
];

let flippedCards: HTMLElement[] = [];  
let matchCount = 0;  
let boardLocked = false;  

const gameBoard = document.getElementById('game-board')!;
const matchCountElement = document.getElementById('match-count')!;


function setupGame() {
    const shuffledCards = shuffle(cards);
    gameBoard.innerHTML = '';  

    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'hidden');
        cardElement.setAttribute('data-index', index.toString());
        cardElement.addEventListener('click', handleCardClick);
        gameBoard.appendChild(cardElement);
    });
}


function shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
}


function handleCardClick(event: Event): void {
    const cardElement = event.target as HTMLElement;

    
    if (cardElement.classList.contains('flipped') || boardLocked) {
        return;
    }

    const cardIndex = cardElement.getAttribute('data-index');
    if (cardIndex === null) return;

    
    cardElement.textContent = cards[parseInt(cardIndex)].symbol;
    cardElement.classList.remove('hidden');
    cardElement.classList.add('flipped');
    flippedCards.push(cardElement);

    
    if (flippedCards.length === 2) {
        boardLocked = true;
        checkMatch();
    }
}

function checkMatch(): void {
    const [firstCard, secondCard] = flippedCards;

    const firstSymbol = firstCard.textContent;
    const secondSymbol = secondCard.textContent;

    if (firstSymbol === secondSymbol) {
    
        flippedCards = [];
        boardLocked = false;
        updateMatchCount();
    } else {
      
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



function updateMatchCount(): void {
    matchCount++;
    matchCountElement.textContent = `Egyezések: ${matchCount}`;
}


function restartGame(): void {
    matchCount = 0;
    flippedCards = [];
    boardLocked = false;
    setupGame();
    matchCountElement.textContent = `Egyezések: ${matchCount}`;
}


setupGame();
