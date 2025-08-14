const fruits = [
  '🍓', '🍋', '🍇', '🍎', '🍌', '🍒', '🍍', '🥝'
]; // 8 buah → 16 kartu total (2x setiap buah)

let cards = [...fruits, ...fruits]; // duplikat
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;

const gameBoard = document.getElementById("gameBoard");
const message = document.getElementById("message");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createBoard() {
  shuffle(cards);
  cards.forEach(fruit => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.fruit = fruit;

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');

    const back = document.createElement('div');
    back.classList.add('card-back');
    back.textContent = fruit;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener('click', () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard || card === firstCard || card.classList.contains('matched')) return;

  card.classList.add('flip');

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true;

    checkMatch();
  }
}

function checkMatch() {
  const isMatch = firstCard.dataset.fruit === secondCard.dataset.fruit;

  if (isMatch) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matches++;

    if (matches === fruits.length) {
      message.textContent = "🎉 Selamat! Kamu mencocokkan semua pasangan!";
    }

    resetBoard();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

createBoard();
