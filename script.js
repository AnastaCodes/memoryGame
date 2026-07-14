const images = [
  "img1.png",
  "img2.png",
  "img3.png",
  "img4.png",
  "img5.png",
  "img6.png",
  "img7.png",
  "img8.png",
]; 
const cards = [...images, ...images]; // cards with double set of images
const gameBoard = document.getElementById("game");
let firstCard = null; // first flipped card
let secondCard = null; // second flipped card
let matches = 0; // number of matched pairs
let lockBoard = false;
let clicks = 0;
let startTime;
let timerInterval;

// shuffle cards
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
shuffle(cards);

// create cards
function createCards() {
  cards.forEach((imageSrc) => {
    let card = document.createElement("div");
    let img = document.createElement("img");
    img.src = `./img/${imageSrc}`;
    card.appendChild(img);
    card.classList.add("card");
    gameBoard.appendChild(card);
    card.addEventListener("click", flipCard);
  });
}

createCards();

// start timer when the first card is clicked
function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const now = new Date();
  const elapsed = Math.floor((now - startTime) / 1000);
  const secondText = elapsed === 1 ? "second" : "seconds";
  document.getElementById("timer").textContent = `Time: ${elapsed} ${secondText}`;
}

// flip card
function flipCard(event) {
  if (lockBoard) return; // if lockBoard is true, do nothing
  if (!startTime) startTimer(); // start timer

  clicks++; // click counter

  let clickedCard;

  if (event.target.classList.contains("card")) {
    clickedCard = event.target;
  } else {
    clickedCard = event.target.parentNode;
  }

  if (clickedCard === firstCard) return; // double-click on the same card

  clickedCard.classList.add("flip");

  if (!firstCard) {
    firstCard = clickedCard;
    return;
  } else {
    secondCard = clickedCard;
    lockBoard = true;
    checkForMatch();
  }
}

// check for matching cards
function checkForMatch() {
  if (
    firstCard.querySelector("img").src === secondCard.querySelector("img").src
  ) {
    firstCard.classList.add("match");
    secondCard.classList.add("match");
    disableCards();
  } else {
    unflipCards();
  }
}

// disable cards if they match. End game and congratulations if all cards are found
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  matches += 1;
  if (matches === 8) {
    showStats();
  }
  resetBoard();
}

// unflip cards if they don't match
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 800);
}

// reset the board state
function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

//at the end of the game
function showStats() {
  clearInterval(timerInterval);
  const endTime = new Date();
  const timeTaken = Math.round((endTime - startTime) / 1000); // time in seconds
  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stats-container");
  statsContainer.innerHTML = `
    <div class="stats">
      <p>Time Taken: ${timeTaken} seconds</p>
      <p>Clicks: ${clicks}</p>
      <button id="ok">OK</button>
      <button id="restart">Restart</button>
    </div>
  `;
  document.body.appendChild(statsContainer);

  document.getElementById("ok").addEventListener("click", () => {
    statsContainer.remove();
  });

  document.getElementById("restart").addEventListener("click", () => {
    statsContainer.remove();
    resetGame();
  });
  document.getElementById("timer").textContent = `Time: 0 seconds`;
}

// reset the game
function resetGame() {
  clearInterval(timerInterval);
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matches = 0;
  clicks = 0;
  startTime = null;
  shuffle(cards);
  gameBoard.innerHTML = "";
  createCards();
}
