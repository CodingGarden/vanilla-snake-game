const gameElement = document.querySelector('#game');
const scoreElement = document.querySelector('#score');
const scoreWrapperElement = document.querySelector('#scoreWrapper');
const gameoverElement = document.querySelector('#gameOverElement');

const numRows = 20;
const numCols = 20;
let frameRate = 200;

const directions = {
  'up': -1,
  'down': 1,
  'left': -1,
  'right': 1,
};

function getStartingState() {
  return {
    score: 0,
    over: false,
    snake: {
      direction: {
        col: 0,
        row: -1,
      },
      head: {
        col: Math.floor(numCols / 2) + 1,
        row: Math.floor(numRows / 2) + 1,
      },
      tail: []
    },
    apple: {},
  }
}

let gameState = getStartingState();

gameState.apple = getRandomAppleLocation();

function initGrid() {
  gameElement.style.gridTemplateRows = `repeat(1fr, ${numRows})`;
  gameElement.style.gridTemplateCols = `repeat(1fr, ${numCols})`;
  const grid = {};
  for (let row = 1; row <= numRows; row++) {
    for (let col = 1; col <= numCols; col++) {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.style.gridRow = row;
      cellElement.style.gridColumn = col;
      gameElement.append(cellElement);
      grid[`${row},${col}`] = cellElement;
    }
  }
  return grid;
}

const grid = initGrid();

function reset() {
  scoreWrapperElement.style.display = '';
  gameoverElement.style.display = 'none';
  gameState = getStartingState();
  gameState.apple = getRandomAppleLocation();
  draw();
}

function draw() {
  if (gameState.over) {
    scoreWrapperElement.style.display = 'none';
    gameoverElement.style.display = '';
    gameoverElement.innerHTML = `
      <p>GAME OVER - You scored: ${gameState.score}</p>
      <center><button onclick="reset()">PLAY AGAIN</button></center>
    `;
    return;
  };

  document.querySelectorAll('.cell').forEach((cell) => {
    cell.className = 'cell';
  });

  gameState.snake.tail.forEach((cell) => {
    const cellElement = grid[`${cell.row},${cell.col}`];
    cellElement.classList.add('snake-tail');
  });

  const headCell = grid[`${gameState.snake.head.row},${gameState.snake.head.col}`];
  headCell.classList.add('snake-head');

  const appleCell = grid[`${gameState.apple.row},${gameState.apple.col}`];
  appleCell.classList.add('apple');


  scoreElement.textContent = gameState.score;

  setTimeout(update, frameRate);
}

function update() {
  if (gameState.snake.head.row === gameState.apple.row
    && gameState.snake.head.col === gameState.apple.col) {
      gameState.score += 1;
      frameRate /= 1.1;
      gameState.snake.tail.push(gameState.apple);
      gameState.apple = getRandomAppleLocation();
  }

  gameState.snake.tail.unshift({
    ...gameState.snake.head,
  });
  gameState.snake.tail.pop();

  gameState.snake.head.row += gameState.snake.direction.row;
  gameState.snake.head.col += gameState.snake.direction.col;

  if (gameState.snake.head.row <= 0
    || gameState.snake.head.row > numRows
    || gameState.snake.head.col <= 0
    || gameState.snake.head.col > numCols) {
    gameState.over = true;
  } else if (gameState
      .snake
      .tail
      .some((cell) => cell.row === gameState.snake.head.row && cell.col === gameState.snake.head.col)) {
    gameState.over = true;
  }

  setTimeout(draw, frameRate);
}

function getRandomAppleLocation() {
  const randomRow = Math.floor(Math.random() * numRows) + 1;
  const randomCol = Math.floor(Math.random() * numCols) + 1;

  const cells = [gameState.snake.head, ...gameState.snake.tail];
  if (cells.some((cell) => cell.row === randomRow && cell.col === randomCol)) {
    return getRandomAppleLocation();
  }

  return {
    row: randomRow,
    col: randomCol,
  }
}

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      if (gameState.snake.direction.col === 1) break;
      gameState.snake.direction.row = 0;
      gameState.snake.direction.col = -1;
      break;
    case 'ArrowDown':
      if (gameState.snake.direction.row === -1) break;
      gameState.snake.direction.row = 1;
      gameState.snake.direction.col = 0;
      break;
    case 'ArrowRight':
      if (gameState.snake.direction.col === -1) break;
      gameState.snake.direction.row = 0;
      gameState.snake.direction.col = 1;
      break;
    case 'ArrowUp':
      if (gameState.snake.direction.row === 1) break;
      gameState.snake.direction.row = -1;
      gameState.snake.direction.col = 0;
      break;
    default:
      break;
  }
});

draw();