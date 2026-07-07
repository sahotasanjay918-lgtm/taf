/**
 * moves.ts — answers "where is this piece allowed to go?"
 *
 * Rules encoded here (confirmed with you earlier):
 *  - Pieces move like a rook: any distance, horizontal or
 *    vertical only, never diagonal.
 *  - A piece cannot jump over another piece.
 *  - Only the king may ever LAND on the throne or a corner.
 *    Other pieces may pass THROUGH an empty throne/corner
 *    square, they just can't stop there.
 */
import type { Board, Position, Player } from "./types";
import { ownerOf } from "./types";
import { isInBounds, isSpecialSquare } from "./board";

const DIRECTIONS: Position[] = [
  { row: -1, col: 0 }, // up
  { row: 1, col: 0 }, // down
  { row: 0, col: -1 }, // left
  { row: 0, col: 1 }, // right
];

export function pieceAt(board: Board, pos: Position) {
  return board[pos.row][pos.col];
}

/** All legal destination squares for the piece sitting at `from`. */
export function getLegalMoves(board: Board, from: Position): Position[] {
  const piece = pieceAt(board, from);
  if (!piece) return [];

  const moves: Position[] = [];

  for (const dir of DIRECTIONS) {
    let step = 1;
    while (true) {
      const next: Position = {
        row: from.row + dir.row * step,
        col: from.col + dir.col * step,
      };
      if (!isInBounds(next)) break;
      if (pieceAt(board, next) !== null) break; // blocked, can't jump pieces

      const isRestricted = isSpecialSquare(next) && piece !== "king";
      if (!isRestricted) {
        moves.push(next);
      }
      // Note: even if this square is restricted (can't land), a
      // non-king piece CAN still continue moving past it in a
      // straight line, since it's just passing through empty space.

      step += 1;
    }
  }

  return moves;
}

/** Every (from, to) pair currently available to the given player. */
export function getAllLegalMoves(
  board: Board,
  player: Player
): { from: Position; to: Position }[] {
  const all: { from: Position; to: Position }[] = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      if (ownerOf(piece) !== player) continue;
      const from = { row, col };
      for (const to of getLegalMoves(board, from)) {
        all.push({ from, to });
      }
    }
  }
  return all;
}

export function hasAnyLegalMove(board: Board, player: Player): boolean {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = board[row][col];
      if (!piece) continue;
      if (ownerOf(piece) !== player) continue;
      if (getLegalMoves(board, { row, col }).length > 0) return true;
    }
  }
  return false;
}
