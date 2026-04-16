const HUMAN = "X";
const AI = "O";
const EMPTY = "";

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetButton = document.getElementById("resetButton");

let board = Array(9).fill(EMPTY);
let gameOver = false;

const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function renderBoard() {
  boardElement.innerHTML = "";

  board.forEach((value, index) => {
    const cell = document.createElement("button");
    cell.className = "cell";
    if (value !== EMPTY || gameOver) {
      cell.classList.add("disabled");
      cell.disabled = true;
    }
    cell.textContent = value;
    cell.addEventListener("click", () => onCellClick(index));
    boardElement.appendChild(cell);
  });
}

function checkWinner(boardToCheck) {
  for (const [a, b, c] of winCombinations) {
    if (
      boardToCheck[a] &&
      boardToCheck[a] === boardToCheck[b] &&
      boardToCheck[a] === boardToCheck[c]
    ) {
      return boardToCheck[a];
    }
  }

  if (!boardToCheck.includes(EMPTY)) {
    return "Draw";
  }

  return null;
}

function getAvailableMoves(boardToCheck) {
  return boardToCheck
    .map((value, index) => (value === EMPTY ? index : null))
    .filter((index) => index !== null);
}

function minimax(boardState, player) {
  const winner = checkWinner(boardState);
  if (winner === AI) return { score: 10 };
  if (winner === HUMAN) return { score: -10 };
  if (winner === "Draw") return { score: 0 };

  const moves = getAvailableMoves(boardState);
  let best;

  if (player === AI) {
    best = { score: -Infinity };
  } else {
    best = { score: Infinity };
  }

  for (const move of moves) {
    boardState[move] = player;
    const result = minimax(boardState, player === AI ? HUMAN : AI);
    boardState[move] = EMPTY;

    if (player === AI) {
      if (result.score > best.score) {
        best = { score: result.score, move };
      }
    } else {
      if (result.score < best.score) {
        best = { score: result.score, move };
      }
    }
  }

  return best;
}

function bestMove() {
  return minimax([...board], AI).move;
}

function onCellClick(index) {
  if (gameOver || board[index] !== EMPTY) return;

  board[index] = HUMAN;
  updateGameState();

  if (!gameOver) {
    const move = bestMove();
    if (move !== undefined) {
      board[move] = AI;
      updateGameState();
    }
  }
}

function updateGameState() {
  const winner = checkWinner(board);

  if (winner) {
    gameOver = true;
    if (winner === HUMAN) {
      statusElement.textContent = "You win!";
    } else if (winner === AI) {
      statusElement.textContent = "AI wins. Try again!";
    } else {
      statusElement.textContent = "It's a draw.";
    }
  } else {
    statusElement.textContent = "Your move.";
  }

  renderBoard();
}

function resetGame() {
  board = Array(9).fill(EMPTY);
  gameOver = false;
  statusElement.textContent = "Your move.";
  renderBoard();
}

resetButton.addEventListener("click", resetGame);
renderBoard();
