/**
 * engine.ts — the main "front door" to the game logic.
 *
 * This is the only file the rest of the app (the board UI, the
 * AI, etc.) needs to talk to. It ties together:
 *   - board.ts     (starting layout, special squares)
 *   - moves.ts      (what moves are legal)
 *   - captures.ts   (what gets captured)
 * ...and adds win-condition checking and turn-taking on top.
 */
import type { Board, GameState, Player, Position } from "./types";
import { createInitialBoard, isCorner } from "./board";
import { getLegalMoves, hasAnyLegalMove, pieceAt } from "./moves";
import { findRegularCaptures, isKingCaptured } from "./captures";

export function createGame(): GameState {
  return {
    board: createInitialBoard(),
    turn: "attacker", // confirmed: attacker always moves first
    status: "ongoing",
    winReason: "",
    positionHistory: [],
  };
}

/** Turns a board into a short string, so identical positions can be compared. */
function serializeBoard(board: Board): string {
  return board.map((row) => row.map((c) => c ?? ".").join("")).join("|");
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export interface MoveResult {
  state: GameState;
  /** True if the move was illegal and nothing happened. */
  ok: boolean;
  /** Plain-English reason if ok is false. */
  error?: string;
}

/**
 * Attempts to move a piece from `from` to `to`. Returns a brand
 * new GameState — the original is never modified, which makes it
 * easy for the UI to keep history / support undo later.
 */
export function makeMove(
  state: GameState,
  from: Position,
  to: Position
): MoveResult {
  if (state.status !== "ongoing") {
    return { state, ok: false, error: "The game has already ended." };
  }

  const piece = pieceAt(state.board, from);
  if (!piece) {
    return { state, ok: false, error: "There's no piece on that square." };
  }

  const pieceOwner: Player = piece === "attacker" ? "attacker" : "defender";
  if (pieceOwner !== state.turn) {
    return { state, ok: false, error: "That's not your piece to move." };
  }

  const legalMoves = getLegalMoves(state.board, from);
  const isLegal = legalMoves.some((m) => m.row === to.row && m.col === to.col);
  if (!isLegal) {
    return { state, ok: false, error: "That move isn't allowed." };
  }

  // --- Apply the move ---
  const board = cloneBoard(state.board);
  board[from.row][from.col] = null;
  board[to.row][to.col] = piece;

  // --- Resolve captures caused by this move ---
  const capturedPositions = findRegularCaptures(board, state.turn, to);
  for (const pos of capturedPositions) {
    board[pos.row][pos.col] = null;
  }

  let status: GameState["status"] = "ongoing";
  let winReason = "";

  // --- Check win conditions, in a sensible order ---

  // 1. Defender wins immediately if the king just reached a corner.
  if (piece === "king" && isCorner(to)) {
    status = "defender_win";
    winReason = "The king reached a corner and escaped!";
  }

  // 2. Attacker wins if this move captured the king.
  //    (Only checked after an attacker's move — see captures.ts notes.)
  if (status === "ongoing" && state.turn === "attacker" && isKingCaptured(board)) {
    status = "attacker_win";
    winReason = "The king was surrounded on all four sides.";
  }

  const nextTurn: Player = state.turn === "attacker" ? "defender" : "attacker";

  // 3. Whoever's turn is next loses if they have no legal moves at all.
  if (status === "ongoing" && !hasAnyLegalMove(board, nextTurn)) {
    status = nextTurn === "defender" ? "attacker_win" : "defender_win";
    winReason =
      nextTurn === "defender"
        ? "The defender has no legal moves left."
        : "The attacker has no legal moves left.";
  }

  // 4. Threefold repetition -> attacker wins (confirmed with you).
  const positionKey = serializeBoard(board) + "|" + nextTurn;
  const positionHistory = [...state.positionHistory, positionKey];
  if (status === "ongoing") {
    const repeatCount = positionHistory.filter((p) => p === positionKey).length;
    if (repeatCount >= 3) {
      status = "attacker_win";
      winReason = "The same position repeated three times.";
    }
  }

  const newState: GameState = {
    board,
    turn: nextTurn,
    status,
    winReason,
    positionHistory,
  };

  return { state: newState, ok: true };
}

export { getLegalMoves } from "./moves";
export { createInitialBoard } from "./board";
