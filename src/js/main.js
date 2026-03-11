import Utils from "./util.js";

const SIZE = 3;
const EMPTY = -1;

const GameBoard = (function() {
  const board = Array.from({ length: SIZE }, () => new Array(SIZE).fill(EMPTY));

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
    reset,
    play,
    checkWin,
    printToConsole,
  };
})();

const Input = (function() {
  return {
    getPlay: () => {
      const raw = prompt("{r} {c}:");
      return raw.split(" ").map((n) => Number(n));
    },
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

  const changePlayer = function(idx, newName) {
    if (!(idx === 0 || idx === 1)) {
      return false;
    }
    players[idx].name = newName;
    return true;
  };

  const playGame = function() {
    GameBoard.reset();

    let turn = 0,
      round = 0;

    while (!GameBoard.checkWin().end && round < SIZE * SIZE) {
      let success = false;
      while (!success) {
        let [r, c] = Input.getPlay();
        success = GameBoard.play(r, c, players[turn].getId()).success;
      }
      console.clear();
      console.log("round: ", round);
      GameBoard.printToConsole();
      ++round;
      turn = turn ? 0 : 1;
    }

    const result = GameBoard.checkWin();
    if (result.end) {
      return {
        outcome: players[result.winner].getName() + " won",
      };
    } else {
      return {
        outcome: "draw",
      };
    }
  };

  return {
    playGame,
  };
})();

console.log(Game.playGame());
