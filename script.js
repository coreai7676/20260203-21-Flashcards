// Flashcards App - Study with 3D flip animations

// Sample flashcard decks
const decks = {
    javascript: [
        { front: 'What is a closure?', back: 'A closure is a function that has access to its outer function scope even after the outer function has returned.' },
        { front: 'What is the difference between == and ===?', back: '== performs type coercion before comparison, while === checks for strict equality without type coercion.' },
        { front: 'What is hoisting?', back: 'Hoisting is JavaScript\'s default behavior of moving declarations to the top of their containing scope.' },
        { front: 'What is the event loop?', back: 'The event loop is a mechanism that allows JavaScript to perform non-blocking operations by offloading operations to the system kernel.' },
        { front: 'What is a Promise?', back: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation.' },
        { front: 'What is async/await?', back: 'Async/await is syntactic sugar built on top of Promises that makes asynchronous code look and behave more like synchronous code.' }
    ],
    html: [
        { front: 'What does HTML stand for?', back: 'HyperText Markup Language' },
        { front: 'What is the purpose of the <head> tag?', back: 'The <head> tag contains metadata about the HTML document, including title, character set, styles, and scripts.' },
        { front: 'What is the difference between <div> and <span>?', back: '<div> is a block-level element used for grouping, while <span> is an inline element for styling text.' },
        { front: 'What are semantic HTML elements?', back: 'Semantic elements clearly describe their meaning to both the browser and developer (e.g., <header>, <nav>, <article>, <footer>).' },
        { front: 'What does the alt attribute do?', back: 'The alt attribute provides alternative text for an image if it cannot be displayed.' }
    ],
    css: [
        { front: 'What is the box model?', back: 'The box model consists of margins, borders, padding, and the actual content area.' },
        { front: 'What is the difference between relative and absolute positioning?', back: 'Relative positions relative to its normal position; absolute positions relative to its nearest positioned ancestor.' },
        { front: 'What are CSS Flexbox and Grid?', back: 'Flexbox is for one-dimensional layouts; Grid is for two-dimensional layouts.' },
        { front: 'What is a media query?', back: 'A media query allows content to adapt to different screen sizes and device characteristics.' },
        { front: 'What is the difference between classes and IDs?', back: 'Classes can be used multiple times; IDs should be unique and used only once per page.' }
    ]
};

// State
let currentDeck = decks.javascript;
let currentCardIndex = 0;
let isFlipped = false;
let stats = {
    javascript: { viewed: 0, flipped: 0 },
    html: { viewed: 0, flipped: 0 },
    css: { viewed: 0, flipped: 0 }
};

// DOM Elements
const cardInner = document.getElementById('card-inner');
const cardFront = document.getElementById('card-front');
const cardBack = document.getElementById('card-back');
const deckSelect = document.getElementById('deck-select');
const prevBtn = document.getElementById('prev-btn');
const flipBtn = document.getElementById('flip-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const studyModeBtn = document.getElementById('study-mode-btn');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const statsViewed = document.getElementById('stats-viewed');
const statsFlipped = document.getElementById('stats-flipped');

let studyMode = false;

// Initialize
function init() {
    loadStats();
    loadCard();
    updateStats();
    updateProgress();
}

// Load current card
function loadCard() {
    const card = currentDeck[currentCardIndex];
    cardFront.textContent = card.front;
    cardBack.textContent = studyMode ? 'Click to reveal' : card.back;
    isFlipped = false;
    cardInner.classList.remove('flipped');
    
    // Update stats
    const deckName = deckSelect.value;
    stats[deckName].viewed++;
    saveStats();
    updateStats();
}

// Flip card
function flipCard() {
    isFlipped = !isFlipped;
    cardInner.classList.toggle('flipped');
    
    const deckName = deckSelect.value;
    if (isFlipped) {
        stats[deckName].flipped++;
        saveStats();
        updateStats();
        
        if (studyMode) {
            setTimeout(() => {
                cardBack.textContent = currentDeck[currentCardIndex].back;
            }, 300);
        }
    }
}

// Next card
function nextCard() {
    currentCardIndex = (currentCardIndex + 1) % currentDeck.length;
    loadCard();
    updateProgress();
}

// Previous card
function prevCard() {
    currentCardIndex = (currentCardIndex - 1 + currentDeck.length) % currentDeck.length;
    loadCard();
    updateProgress();
}

// Shuffle deck
function shuffleDeck() {
    for (let i = currentDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
    }
    currentCardIndex = 0;
    loadCard();
    updateProgress();
}

// Toggle study mode
function toggleStudyMode() {
    studyMode = !studyMode;
    studyModeBtn.textContent = studyMode ? '🎯 Exit Study Mode' : '🎯 Study Mode';
    studyModeBtn.classList.toggle('active', studyMode);
    if (isFlipped) {
        flipCard();
    }
}

// Change deck
function changeDeck() {
    const deckName = deckSelect.value;
    currentDeck = decks[deckName];
    currentCardIndex = 0;
    loadCard();
    updateProgress();
}

// Update progress bar
function updateProgress() {
    const progress = ((currentCardIndex + 1) / currentDeck.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${currentCardIndex + 1} / ${currentDeck.length}`;
}

// Update stats display
function updateStats() {
    const deckName = deckSelect.value;
    statsViewed.textContent = stats[deckName].viewed;
    statsFlipped.textContent = stats[deckName].flipped;
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('flashcardStats', JSON.stringify(stats));
}

// Load stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('flashcardStats');
    if (saved) {
        stats = JSON.parse(saved);
    }
}

// Event Listeners
deckSelect.addEventListener('change', changeDeck);
flipBtn.addEventListener('click', flipCard);
nextBtn.addEventListener('click', nextCard);
prevBtn.addEventListener('click', prevCard);
shuffleBtn.addEventListener('click', shuffleDeck);
studyModeBtn.addEventListener('click', toggleStudyMode);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case ' ':
            e.preventDefault();
            flipCard();
            break;
        case 'ArrowRight':
            nextCard();
            break;
        case 'ArrowLeft':
            prevCard();
            break;
    }
});

// Initialize app
init();
