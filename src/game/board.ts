/**
 * board.ts — sets up the starting position, and answers simple
 * questions about the board like "is this square a corner?".
 */
import type { Board, Position } from "./types";
import { BOARD_SIZE } from "./types";

/**
 * Builds the standard starting layout you sent over in the Figma
 * diagram: 24 attackers around the edges, 12 defenders + 1 king
 * in a diamond around the centre throne.
 */
export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );

  const set = (row: number, col: number, piece: Board[number][number]) => {
    board[row][col] = piece;
  };

  // ---- Attackers (24 total) ----
  const attackerEdgeCols = [3, 4, 5, 6, 7];
  attackerEdgeCols.forEach((col) => {
    set(0, col, "attacker");
    set(10, col, "attacker");
  });
  const attackerEdgeRows = [3, 4, 5, 6, 7];
  attackerEdgeRows.forEach((row) => {
    set(row, 0, "attacker");
    set(row, 10, "attacker");
  });
  // the 4 "extra" attackers just inside each edge midpoint
  set(1, 5, "attacker");
  set(9, 5, "attacker");
  set(5, 1, "attacker");
  set(5, 9, "attacker");

  // ---- Defenders (12) + King (1), diamond around the throne ----
  set(3, 5, "defender");
  set(4, 4, "defender");
  set(4, 5, "defender");
  set(4, 6, "defender");
  set(5, 3, "defender");
  set(5, 4, "defender");
  set(5, 6, "defender");
  set(5, 7, "defender");
  set(6, 4, "defender");
  set(6, 5, "defender");
  set(6, 6, "defender");
  set(7, 5, "defender");
  set(5, 5, "king");

  return board;
}

export const THRONE: Position = { row: 5, col: 5 };

export const CORNERS: Position[] = [
  { row: 0, col: 0 },
  { row: 0, col: BOARD_SIZE - 1 },
  { row: BOARD_SIZE - 1, col: 0 },
  { row: BOARD_SIZE - 1, col: BOARD_SIZE - 1 },
];

export function isCorner(pos: Position): boolean {
  return CORNERS.some((c) => c.row === pos.row && c.col === pos.col);
}

export function isThrone(pos: Position): boolean {
  return pos.row === THRONE.row && pos.col === THRONE.col;
}

/** Corners + throne are the two kinds of "special" squares. */
export function isSpecialSquare(pos: Position): boolean {
  return isThrone(pos) || isCorner(pos);
}

export function isInBounds(pos: Position): boolean {
  return (
    pos.row >= 0 &&
    pos.row < BOARD_SIZE &&
    pos.col >= 0 &&
    pos.col < BOARD_SIZE
  );
}

export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

/**
 * A board showing ONLY the attacker pieces — used in the
 * "Attack the King!" pre-game popup, matching your Figma preview.
 */
export function createAttackerPreviewBoard(): Board {
  const board = createInitialBoard();
  return board.map((row) =>
    row.map((cell) => (cell === "attacker" ? cell : null))
  );
}

/**
 * A board showing ONLY the defenders + king — used in the
 * "Defend the King!" pre-game popup.
 */
export function createDefenderPreviewBoard(): Board {
  const board = createInitialBoard();
  return board.map((row) =>
    row.map((cell) => (cell === "attacker" ? null : cell))
  );
}

/**
 * A blank board with nothing on it but one highlighted corner —
 * used in the "defender wins by reaching a corner" tutorial slide.
 */
export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

/**
 * A small demo showing the king surrounded on all 4 sides by
 * attackers — used in the "attacker wins by surrounding the king"
 * tutorial slide. This is purely illustrative, not a real position.
 */
export function createKingSurroundedDemoBoard(): Board {
  const board = createEmptyBoard();
  const center = { row: 5, col: 5 };
  board[center.row][center.col] = "king";
  board[center.row - 1][center.col] = "attacker";
  board[center.row + 1][center.col] = "attacker";
  board[center.row][center.col - 1] = "attacker";
  board[center.row][center.col + 1] = "attacker";
  return board;
}

/**
 * A small demo showing a capture in progress — one defender
 * sandwiched between two attackers — used in the capturing
 * tutorial slide.
 */
export function createCaptureDemoBoard(): Board {
  const board = createEmptyBoard();
  board[5][4] = "attacker";
  board[5][5] = "defender";
  board[5][6] = "attacker";
  return board;
}
