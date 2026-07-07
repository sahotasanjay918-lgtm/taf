/**
 * ai.ts — the computer opponent.
 *
 * Two difficulty levels, as agreed:
 *   - "easy":  picks a random legal move. No strategy at all —
 *              deliberately beatable for newer players.
 *   - "hard":  looks two moves ahead (its move, then your best
 *              reply) using a technique called "minimax" and
 *              picks whichever move leaves it in the strongest
 *              position, using the scoring rules below.
 *
 * This file only ever talks to the engine through makeMove() and
 * getAllLegalMoves() — it has no special access to the rules, so
 * it's playing by exactly the same rules a human does.
 */
import type { GameState, Player, Position, Board } from "./types";
import { getAllLegalMoves } from "./moves";
import { makeMove } from "./engine";
import { CORNERS } from "./board";
import { findKing } from "./captures";

export type Difficulty = "easy" | "hard";

export interface AiMove {
  from: Position;
  to: Position;
}

/** Distance from a position to the nearest corner (fewest rook-moves, roughly). */
function distanceToNearestCorner(pos: Position): number {
  return Math.min(
    ...CORNERS.map((c) => Math.abs(c.row - pos.row) + Math.abs(c.col - pos.col))
  );
}

/**
 * Scores a board position. Positive = good for the attacker,
 * negative = good for the defender. Used so the AI can compare
 * "how good is this position for me" across different possible
 * moves.
 */
function evaluateBoard(board: Board): number {
  let attackerCount = 0;
  let defenderCount = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell === "attacker") attackerCount++;
      if (cell === "defender") defenderCount++;
    }
  }

  // Material: losing a defender hurts the defender more than
  // losing an attacker hurts the attacker, since there are fewer
  // of them to begin with.
  let score = attackerCount * 10 - defenderCount * 15;

  // King safety: the further the king is from any corner, the
  // better for the attacker (harder for the king to escape).
  const kingPos = findKing(board);
  if (kingPos) {
    const distance = distanceToNearestCorner(kingPos);
    score += (10 - distance) * 4; // closer to a corner -> lower score (worse for attacker)
  }

  return score;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Looks `depth` moves ahead and returns the best score reachable
 * from this position, from the point of view of `maximizingPlayer`
 * being "attacker" (attacker tries to maximise the score,
 * defender tries to minimise it — see evaluateBoard above).
 */
function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number
): number {
  if (state.status !== "ongoing" || depth === 0) {
    if (state.status === "attacker_win") return 100000 - (2 - depth);
    if (state.status === "defender_win") return -100000 + (2 - depth);
    return evaluateBoard(state.board);
  }

  const moves = getAllLegalMoves(state.board, state.turn);
  if (moves.length === 0) {
    return evaluateBoard(state.board);
  }

  const maximizing = state.turn === "attacker";
  let best = maximizing ? -Infinity : Infinity;

  for (const move of moves) {
    const result = makeMove(state, move.from, move.to);
    if (!result.ok) continue;

    const value = minimax(result.state, depth - 1, alpha, beta);

    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, value);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, value);
    }
    if (beta <= alpha) break; // alpha-beta pruning: stop exploring, this branch can't win
  }

  return best;
}

/**
 * Chooses the AI's move for the given player and difficulty.
 * Returns null if the AI has no legal moves at all (shouldn't
 * normally happen — the game would already have ended).
 */
export function chooseAiMove(
  state: GameState,
  aiPlayer: Player,
  difficulty: Difficulty
): AiMove | null {
  const moves = getAllLegalMoves(state.board, aiPlayer);
  if (moves.length === 0) return null;

  if (difficulty === "easy") {
    return pickRandom(moves);
  }

  // "hard": evaluate every possible move two plies deep and pick
  // the one that leaves the AI in the best position.
  const maximizing = aiPlayer === "attacker";
  let bestMove: AiMove = moves[0];
  let bestScore = maximizing ? -Infinity : Infinity;

  for (const move of moves) {
    const result = makeMove(state, move.from, move.to);
    if (!result.ok) continue;

    const score = minimax(result.state, 2, -Infinity, Infinity);

    if (maximizing ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
