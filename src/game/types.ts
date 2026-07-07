/**
 * types.ts — the "nouns" of the game.
 *
 * Every other file in src/game/ builds on these basic shapes.
 * Nothing in here does any logic — it just describes what a
 * board, a piece, a position, etc. LOOK like.
 */

/** The three kinds of pieces that can sit on a square. */
export type PieceType = "attacker" | "defender" | "king";

/** The two sides a human or the AI can play. */
export type Player = "attacker" | "defender";

/** A single square's contents — a piece, or empty. */
export type Cell = PieceType | null;

/** The 11x11 grid. board[row][col] */
export type Board = Cell[][];

/** A square on the board, using 0-10 for both row and column. */
export interface Position {
  row: number;
  col: number;
}

export const BOARD_SIZE = 11;

/** Which player "owns" a given piece type. */
export function ownerOf(piece: PieceType): Player {
  return piece === "attacker" ? "attacker" : "defender";
}

/** Result of trying to end the game after a move. */
export type GameStatus = "ongoing" | "attacker_win" | "defender_win";

export interface GameState {
  board: Board;
  /** Whose turn it currently is. */
  turn: Player;
  status: GameStatus;
  /** Plain-English reason the game ended, e.g. "King reached a corner". Empty while ongoing. */
  winReason: string;
  /**
   * A history of serialized board positions, used to detect the
   * threefold-repetition rule. See engine.ts for how this is used.
   */
  positionHistory: string[];
}
