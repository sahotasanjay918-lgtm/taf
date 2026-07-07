/**
 * captures.ts — answers "did that move just capture anything?"
 *
 * Rules encoded here (confirmed with you earlier):
 *  - A regular piece (attacker or defender) is captured when the
 *    piece that just moved sandwiches it against one of the
 *    mover's own pieces, on two opposite sides (left+right OR
 *    top+bottom). The throne/corners are NOT hostile — they
 *    don't count as a "friendly piece" for sandwiching.
 *  - Moving your own piece into a sandwich voluntarily is always
 *    safe — capture only happens as a result of the CAPTURING
 *    side's move, never the victim's own move. That's why this
 *    function only ever looks at squares next to the piece that
 *    just moved.
 *  - The king is only captured when ALL 4 orthogonal neighbours
 *    are attacker pieces — the edge of the board does NOT count
 *    as one of those 4 sides. This check only ever runs after an
 *    ATTACKER's move (same "capture must be deliberate" logic
 *    above — the king can safely walk himself into a surrounded
 *    square without being auto-captured by his own move).
 */
import type { Board, Player, Position } from "./types";
import { isInBounds } from "./board";

const DIRECTIONS: Position[] = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

function add(a: Position, b: Position): Position {
  return { row: a.row + b.row, col: a.col + b.col };
}

/**
 * Checks for regular (non-king) captures caused by the piece that
 * just landed on `movedTo`. Returns the list of captured positions.
 */
export function findRegularCaptures(
  board: Board,
  moverPlayer: Player,
  movedTo: Position
): Position[] {
  const captured: Position[] = [];

  for (const dir of DIRECTIONS) {
    const neighbourPos = add(movedTo, dir);
    if (!isInBounds(neighbourPos)) continue;

    const neighbour = board[neighbourPos.row][neighbourPos.col];
    if (!neighbour) continue;
    if (neighbour === "king") continue; // king has its own capture rule
    const neighbourOwner: Player =
      neighbour === "attacker" ? "attacker" : "defender";
    if (neighbourOwner === moverPlayer) continue; // not an enemy piece

    const beyondPos = add(neighbourPos, dir);
    if (!isInBounds(beyondPos)) continue;

    const beyond = board[beyondPos.row][beyondPos.col];
    if (!beyond) continue;
    const beyondOwner: Player = beyond === "attacker" ? "attacker" : "defender";

    // Sandwiched between two pieces belonging to the mover -> captured.
    // (Throne/corners are plain empty squares here, not hostile,
    // so they never substitute for a "friendly piece".)
    if (beyondOwner === moverPlayer) {
      captured.push(neighbourPos);
    }
  }

  return captured;
}

/**
 * Checks whether the king is now captured. Only call this after an
 * ATTACKER move (see rule note above).
 */
export function isKingCaptured(board: Board): boolean {
  const kingPos = findKing(board);
  if (!kingPos) return false; // shouldn't happen, but stay safe

  for (const dir of DIRECTIONS) {
    const neighbourPos = add(kingPos, dir);
    if (!isInBounds(neighbourPos)) return false; // edge doesn't count
    const neighbour = board[neighbourPos.row][neighbourPos.col];
    if (neighbour !== "attacker") return false;
  }
  return true;
}

export function findKing(board: Board): Position | null {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === "king") return { row, col };
    }
  }
  return null;
}
