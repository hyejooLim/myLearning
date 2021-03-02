'use strict';

const TIMER = 10;
const CARROT_COUNT = 9;
const CARROT_SIZE = '80';

const gameBtn = document.querySelector('.game__btn');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');
const gameField = document.querySelector('.game__field');
const popUp = document.querySelector('.pop-up');
const popUpMessage = document.querySelector('.pop_up__message');
const refreshBtn = document.querySelector('.pop-up__refresh');

// Fetch data
function loadArray() {
  return fetch('data/data.json')
    .then((response) => response.json())
    .then((json) => json.items);
}
loadArray().then((items) => onClick(items));

function displayItems(items) {
  gameField.innerHTML = items.map((item) => createString(item)).join('');
}

function createString(item) {
  const fieldRect = gameField.getBoundingClientRect();
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;
  const x = randomNumber(x1, x2);
  const y = randomNumber(y1, y2);

  return `
    <img src="${item.image}" class="${item.type}" style="position: absolute; left: ${x}px; top: ${y}px" />
  `;
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

let started = false;
let timer = undefined;
let score = CARROT_COUNT;
let sec = TIMER;

const gameBgm = new Audio('sound/bg.mp3');
const carrotBgm = new Audio('sound/carrot_pull.mp3');
const looseBgm = new Audio('sound/bug_pull.mp3');
const winBgm = new Audio('sound/game_win.mp3');
const alertBgm = new Audio('sound/alert.wav');

function onClick(items) {
  gameBtn.addEventListener('click', () => {
    if (started) {
      stopGame('resum');
    } else {
      startGame(items);
    }
  });
}

function startGame(items) {
  started = true;
  gameBgm.play();

  // If you restart game
  if (timer === undefined) {
    sec = TIMER;
    score = CARROT_COUNT;
    displayItems(items);
  }
  showStopBtn();
  showTimerAndScore();
  timerWork();
}

function stopGame(state) {
  started = false;
  if (state === 'bug') {
    gameBgm.pause();
    alertBgm.play();
  }
  else if (state === 'time over') {
    gameBgm.pause();
    looseBgm.play();  
  }
  clearInterval(timer);
  showStartBtn();
}

function showStartBtn() {
  const icon = document.querySelector('.fa-stop');
  icon.classList.add('fa-play');
  icon.classList.remove('fa-stop');
}

function showStopBtn() {
  const icon = document.querySelector('.fa-play');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
  gameScore.innerText = `${score}`;
}

function timerWork() {
  gameTimer.innerText = `0 : ${sec % 60}`;
  timer = setInterval(() => {
    if (sec <= 0) {
      stopGame('time over');
      showPopUp('time over');
      return;
    }
    sec--;
    gameTimer.innerText = `0 : ${sec % 60}`;
  }, 1000);
}

// Event delegation
gameField.addEventListener('click', (e) => {
  if (!started) {
    return;
  }
  const target = e.target;

  if (target.matches('.carrot')) {
    carrotBgm.play();
    score--;
    gameScore.innerText = `${score}`;
    target.remove();

    if (!score) {
      gameBgm.pause();
      winBgm.play();
      stopGame('win');
      showPopUp('win');
    }
  } else if (target.matches('.bug')) {
    stopGame('bug');
    showPopUp('bug');
  }
});

refreshBtn.addEventListener('click', () => {
  timer = undefined;
  gameBgm.currentTime = 0;
  popUp.classList.add('pop-up--hidden');
  loadArray().then((items) => startGame(items));
});

function showPopUp(text) {
  popUp.classList.remove('pop-up--hidden');
  if (text === 'bug') {
    popUpMessage.innerText = 'You loose! 😢';
  } else if (text === 'win') {
    popUpMessage.innerText = 'You win! 🎉';
  } else if (text === 'time over') {
    popUpMessage.innerText = 'Time Over ⏰';
  }
}
