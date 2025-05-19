 document.addEventListener("DOMContentLoaded", function () {
    let score = 0;
    let isGameOver = false;
    let moveIntervalId = null;
    let timerId = null;
    const timeLimit = 5000;

    const scoreEl = document.getElementById('score');
    const gameArea = document.getElementById('game-area');
    const messageEl = document.getElementById('message');
    const startBtn = document.getElementById('start-btn');

    let boxes = [];
    let boxCount = 1;
    let boxSize = 'normal';

    function createBoxes(count) {
      boxes.forEach(b => gameArea.removeChild(b));
      boxes = [];

      for (let i = 0; i < count; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.classList.add(boxSize);
        box.dataset.index = i;
        box.addEventListener('click', boxClicked);
        gameArea.appendChild(box);
        boxes.push(box);
      }
    }

    function moveBoxes() {
      if (isGameOver) return;

      boxes.forEach(box => {
        const maxX = gameArea.clientWidth - box.offsetWidth;
        const maxY = gameArea.clientHeight - box.offsetHeight;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        box.style.left = `${randomX}px`;
        box.style.top = `${randomY}px`;
      });
    }

    function resetTimer() {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        gameOver();
      }, timeLimit);
    }

    function boxClicked(event) {
      if (isGameOver) return;
      event.stopPropagation();

      score++;
      scoreEl.textContent = score;

      if (score === 5) {
        boxCount = 2;
        boxSize = 'normal';
        createBoxes(boxCount);
      } else if (score === 10) {
        boxCount = 3;
        boxSize = 'small';
        createBoxes(boxCount);
      }

      moveBoxes();
      resetTimer();
    }

    function handleClick(event) {
      if (isGameOver) return;

      if (!boxes.includes(event.target)) {
        gameOver();
      }
    }

    function gameOver() {
      isGameOver = true;
      clearInterval(moveIntervalId);
      if (timerId) clearTimeout(timerId);

      boxes.forEach(box => box.style.display = 'none');

      messageEl.textContent = "";
      startBtn.textContent = "Ulangi";
      startBtn.style.display = "inline-block";

      const gameOverText = document.createElement('div');
      gameOverText.id = 'game-over-text';
      Object.assign(gameOverText.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '48px',
        fontWeight: 'bold',
        color: 'white'
      });
      gameOverText.textContent = 'GAME OVER';

      gameArea.appendChild(gameOverText);
    }

    function startGame() {
      const existingGameOver = document.getElementById('game-over-text');
      if (existingGameOver) existingGameOver.remove();

      score = 0;
      isGameOver = false;
      boxCount = 1;
      boxSize = 'normal';

      scoreEl.textContent = score;
      messageEl.textContent = "";
      startBtn.style.display = "none";

      createBoxes(boxCount);
      moveBoxes();

      if (moveIntervalId) clearInterval(moveIntervalId);
      moveIntervalId = setInterval(moveBoxes, 1000);

      resetTimer();
    }

    gameArea.addEventListener('click', handleClick);
    startBtn.addEventListener('click', startGame);
  });
