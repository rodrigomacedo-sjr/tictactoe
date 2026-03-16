import Render from "./render.js";

const SIZE = 3;
const EMPTY = -1;

const GameBoard = (function() {
  const board = Array.from({ length: SIZE }, () => new Array(SIZE).fill(EMPTY));

  const getBoard = () => board;

  const reset = function() {
    for (let i = 0; i < SIZE; ++i) {
      board[i].fill(EMPTY);
    }
  };

  const play = function(row, col, playerId) {
    if (board[row][col] != EMPTY) {
      return { success: false };
    }

    board[row][col] = playerId;
    return { success: true };
  };

  const checkWin = function() {
    for (let r = 0; r < SIZE; ++r) {
      let won = true;
      for (let c = 1; c < SIZE; ++c) {
        won = won && board[r][c] == board[r][c - 1];
      }
      if (won && board[r][0] != EMPTY) {
        return {
          end: true,
          winner: board[r][0],
        };
      }
    }

    for (let c = 0; c < SIZE; ++c) {
      let won = true;
      for (let r = 1; r < SIZE; ++r) {
        won = won && board[r][c] == board[r - 1][c];
      }
      if (won && board[0][c] != EMPTY) {
        return {
          end: true,
          winner: board[0][c],
        };
      }
    }

    {
      let won = true;
      for (let i = 1; i < SIZE; ++i) {
        won = won && board[i][i] == board[i - 1][i - 1];
      }
      if (won && board[0][0] != EMPTY) {
        return {
          end: true,
          winner: board[0][0],
        };
      }
    }

    {
      let won = true;
      for (let i = 0; i < SIZE - 1; ++i) {
        won = won && board[SIZE - i - 1][i] == board[SIZE - i - 2][i + 1];
      }
      if (won && board[SIZE - 1][0] != EMPTY) {
        return {
          end: true,
          winner: board[SIZE - 1][0],
        };
      }
    }

    return {
      end: false,
    };
  };

  const printToConsole = () => {
    console.log("    0 1 2");
    console.log("    v v v");
    for (let r = 0; r < SIZE; ++r) {
      let output = "";
      for (let c = 0; c < SIZE; ++c) {
        output += " " + (board[r][c] != EMPTY ? board[r][c] : " ");
      }
      console.log(r + ": " + output);
    }
  };

  return {
    getBoard,
    reset,
    play,
    checkWin,
    printToConsole,
  };
})();

const Input = (function() {
  const takeTurnInput = function(event) {
    const c = event.target.closest(".cell");
    const row = c.dataset.row;
    const col = c.dataset.col;
    Game.playTurn(row, col);
  };

  const prepareBoard = () => {
    const board = document.querySelector("#board-root");
    board.addEventListener("click", takeTurnInput);
  };

  return {
    takeTurnInput,
    prepareBoard,
  };
})();

const createPlayer = function(id, name) {
  return {
    getId: () => id,
    getName: () => name,
  };
};

const Game = (function() {
  const players = [createPlayer(0, "Riri"), createPlayer(1, "Roger")];

  let turn = 0,
    round = 0;

  const changeTurn = () => (turn = turn ? 0 : 1);
  const updateRound = () => ++round;

  const playTurn = function(r, c) {
    const success = GameBoard.play(r, c, players[turn].getId()).success;
    if (!success) return;
    changeTurn();
    updateRound();

    Render.clearScreen();
    Render.drawBoard(GameBoard.getBoard(), turn);

    Input.prepareBoard();

    const result = GameBoard.checkWin();
    if (result.end) {
      gameOver({
        outcome: "win",
        winner: result.winner,
      });
      return;
    }

    if (round >= SIZE * SIZE) {
      gameOver({ outcome: "draw" });
      return;
    }
  };

  const restart = function() {
    round = 0;
    Render.clearScreen();
    GameBoard.reset();
    Render.drawBoard(GameBoard.getBoard(), turn);
    Input.prepareBoard();
  };

  const gameOver = function(result) {
    const board = document.querySelector("#board-root");
    board.removeEventListener("click", Input.takeTurnInput);
    switch (result.outcome) {
      case "draw":
        Render.resultDraw();
        break;
      case "win":
        const winnerName = players[result.winner].getName();
        Render.resultWin(winnerName);
        break;
    }
  };

  return {
    playTurn,
    restart,
  };
})();

document
  .querySelector("#restart-button")
  .addEventListener("click", Game.restart);

Game.restart();
