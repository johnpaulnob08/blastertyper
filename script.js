// PAGE: Difficulty Selection (homepage.html)
const difficultyButtons = document.querySelectorAll('.difficulty-btns button');
difficultyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    difficultyButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    localStorage.setItem('difficulty', btn.innerText);
  });
});

// PAGE: Game Logic (game.html)
const gameArea = document.querySelector('.game-box');
const inputBox = document.querySelector('.input-box');
const rocket = document.querySelector('.rocket-game');
const controls = document.querySelector('.controls');
let wordList = ['planet', 'star', 'galaxy', 'asteroid', 'comet'];
let currentWord = '';
let wordElement;
let interval;
let speed = 2;
let gameOver = false;

function spawnWord() {
  currentWord = wordList[Math.floor(Math.random() * wordList.length)];
  wordElement = document.createElement('div');
  wordElement.classList.add('word');
  wordElement.innerText = currentWord;
  wordElement.style.top = '100px';
  wordElement.style.left = '0px';
  gameArea.appendChild(wordElement);
}

function moveWord() {
  let x = 0;
  interval = setInterval(() => {
    if (gameOver) return;
    x += speed;
    wordElement.style.left = x + 'px';

    if (x > gameArea.offsetWidth - 100) {
      clearInterval(interval);
      alert('Game Over! Your score: ' + score);
      window.location.href = 'homepage.html';
    }
  }, 30);
}

let score = 0;
inputBox.addEventListener('input', () => {
  const typed = inputBox.value.trim();
  if (typed === currentWord) {
    score++;
    shootBall(currentWord.length);
    clearInterval(interval);
    wordElement.remove();
    inputBox.value = '';
    spawnWord();
    moveWord();
  }
});

function shootBall(times) {
  for (let i = 0; i < times; i++) {
    const ball = document.createElement('img');
    ball.src = 'balls.jpg';
    ball.classList.add('ball');
    ball.style.left = rocket.offsetLeft + 'px';
    ball.style.top = rocket.offsetTop + 20 + 'px';
    gameArea.appendChild(ball);
    animateBall(ball);
  }
}

function animateBall(ball) {
  let pos = rocket.offsetLeft;
  const id = setInterval(() => {
    pos -= 10;
    ball.style.left = pos + 'px';
    if (pos <= 0) {
      clearInterval(id);
      ball.remove();
    }
  }, 20);
}

// Start Game
window.addEventListener('load', () => {
  if (document.querySelector('#game')) {
    spawnWord();
    moveWord();
  }
});
