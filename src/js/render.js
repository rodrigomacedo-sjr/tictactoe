const TEST_BOARD = [
  [0, 1, -1],
  [-1, 0, 1],
  [1, 1, 0],
];

const Render = (function() {
  const BOARD_ROOT = document.querySelector("#board-root");

  const O_CODE = 0;
  const X_CODE = 1;

  const X_SYMBOL = () => {
    const bars = [document.createElement("div"), document.createElement("div")];
    bars[0].className = "x-symbol-a";
    bars[1].className = "x-symbol-b";
    return bars;
  };

  const O_SYMBOL = () => {
    const circle = document.createElement("div");
    circle.className = "o-symbol-a";
    return [circle];
  };

  const getSymbol = (opt) => {
    switch (opt) {
      case X_CODE:
        return X_SYMBOL;
      case O_CODE:
        return O_SYMBOL;
      default:
        return function() {
          return "";
        };
    }
  };

  const clear_screen = () => {
    BOARD_ROOT.innerHTML = "";
  };

  const draw_board = (board) => {
    for (let r = 0; r < board.length; ++r) {
      for (let c = 0; c < board[0].length; ++c) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.append(...getSymbol(board[r][c])());
        BOARD_ROOT.appendChild(cell);
      }
    }
  };

  return {
    clear_screen,
    draw_board,
  };
})();

Render.draw_board(TEST_BOARD);

export default Render;
