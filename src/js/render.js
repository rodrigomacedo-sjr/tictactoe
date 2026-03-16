const TEST_BOARD = [
  [0, 1, -1],
  [-1, 0, 1],
  [1, 1, 0],
];

const Render = (function() {
  const BOARD_ROOT = document.querySelector("#board-root");

  const O_CODE = 0;
  const X_CODE = 1;

  const card = document.createElement("div");
  document.querySelector("body").append(card);

  const X_SYMBOL = () => {
    const bars = [document.createElement("div"), document.createElement("div")];
    bars[0].className = "x-symbol-a";
    bars[1].className = "x-symbol-b";
    const cross = document.createElement("div");
    cross.classList.add("middle-man");
    cross.append(...bars);
    return cross;
  };

  const O_SYMBOL = () => {
    const circle = document.createElement("div");
    circle.className = "o-symbol-a";
    return circle;
  };

  const createHoverFunc = (turn) => {
    const empty = turn ? X_SYMBOL() : O_SYMBOL();
    empty.classList.add("available-empty");
    return empty;
  };

  const getSymbol = (opt, turn) => {
    switch (opt) {
      case X_CODE:
        return X_SYMBOL();
      case O_CODE:
        return O_SYMBOL();
      default:
        return createHoverFunc(turn);
    }
  };

  const clearScreen = () => {
    BOARD_ROOT.innerHTML = "";
    card.innerHTML = "";
    card.className = "invisible";
  };

  const drawBoard = (board, turn) => {
    for (let r = 0; r < board.length; ++r) {
      for (let c = 0; c < board[0].length; ++c) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.append(getSymbol(board[r][c], turn));
        BOARD_ROOT.appendChild(cell);
      }
    }
  };

  const resultDraw = () => {
    card.innerHTML = "TIC TAC TOE!";
    card.className = "draw-card";
  };

  const resultWin = (winnerName) => {
    card.innerHTML = `Congratulations ${winnerName}!`;
    card.className = "win-card";
  };

  return {
    clearScreen,
    drawBoard,
    resultDraw,
    resultWin,
  };
})();

export default Render;
