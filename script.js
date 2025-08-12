const allSymbols = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍉', '🥝', '🍍', '🍑', '🥥', '🍋', '🍈'];

let timer;
let timeLeft = 60;
let score = 0;
let level = 1;
let matchedPairs = 0;

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let cards = [];

function startGame() {
  resetGame();
  generateCards();
  createBoard();
  startTimer();
}

function resetGame() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;
  timeLeft = 60;
  updateHUD();
  clearInterval(timer);
}

function updateHUD() {
  document.getElementById('timer').textContent = timeLeft;
  document.getElementById('score').textContent = score;
  document.getElementById('level').textContent = level;
  document.getElementById('status').textContent = '';
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById('status').textContent = '⏰ Waktu Habis! Game Over!';
      lockBoard = true;
    }
  }, 1000);
}

function generateCards() {
  const symbolsToUse = allSymbols.slice(0, level + 2); // Naikkan jumlah kartu tiap level
  cards = [...symbolsToUse, ...symbolsToUse];
  shuffle(cards);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${Math.min(6, Math.ceil(Math.sqrt(cards.length)))}, 100px)`;

  cards.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    card.textContent = '';
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard(e) {
  if (lockBoard) return;

  const card = e.currentTarget;
  if (card.classList.contains('flipped')) return;

  card.classList.add('flipped');
  card.textContent = card.dataset.symbol;

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    matchedPairs++;
    score += 10;
    resetTurn();

    if (matchedPairs === cards.length / 2) {
      clearInterval(timer);
      document.getElementById('status').textContent = '🎉 Level Selesai!';
      setTimeout(() => {
        level++;
        startGame();
      }, 1500);
    }
  } else {
    score = Math.max(0, score - 5);
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.textContent = '';
      secondCard.textContent = '';
      resetTurn();
    }, 1000);
  }

  updateHUD();
}

function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

startGame();
