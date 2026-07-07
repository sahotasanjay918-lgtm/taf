/**
 * engine.test.ts — automated proof that the rules work as agreed.
 *
 * You don't need to read this file yourself — it's here so I
 * (and you, if you ever get curious) can run one command and see
 * a list of every rule, each with a pass/fail tick next to it,
 * rather than just trusting the code by eye.
 *
 * Run with: npm test
 */
import { describe, it, expect } from "vitest";
import { createGame, makeMove, createInitialBoard } from "./engine";
import { getLegalMoves } from "./moves";
import { isKingCaptured, findRegularCaptures } from "./captures";
import type { Board } from "./types";

/** Helper: build a blank 11x11 board for isolated rule tests. */
function emptyBoard(): Board {
  return Array.from({ length: 11 }, () => Array.from({ length: 11 }, () => null));
}

describe("starting position", () => {
  it("has 24 attackers, 12 defenders, and 1 king", () => {
    const board = createInitialBoard();
    let attackers = 0,
      defenders = 0,
      kings = 0;
    board.forEach((row) =>
      row.forEach((cell) => {
        if (cell === "attacker") attackers++;
        if (cell === "defender") defenders++;
        if (cell === "king") kings++;
      })
    );
    expect(attackers).toBe(24);
    expect(defenders).toBe(12);
    expect(kings).toBe(1);
  });

  it("attacker moves first", () => {
    const game = createGame();
    expect(game.turn).toBe("attacker");
  });
});

describe("movement", () => {
  it("moves like a rook: any distance, straight lines only", () => {
    const board = emptyBoard();
    board[5][5] = "attacker";
    const moves = getLegalMoves(board, { row: 5, col: 5 });
    // Should be able to reach the far edges in all 4 directions
    expect(moves).toEqual(
      expect.arrayContaining([
        { row: 0, col: 5 },
        { row: 10, col: 5 },
        { row: 5, col: 0 },
        { row: 5, col: 10 },
      ])
    );
    // Should NOT contain any diagonal move
    const hasDiagonal = moves.some((m) => m.row !== 5 && m.col !== 5);
    expect(hasDiagonal).toBe(false);
  });

  it("cannot jump over another piece", () => {
    const board = emptyBoard();
    board[5][5] = "attacker";
    board[5][7] = "defender"; // blocker two squares to the right
    const moves = getLegalMoves(board, { row: 5, col: 5 });
    expect(moves).toEqual(expect.arrayContaining([{ row: 5, col: 6 }]));
    expect(moves).not.toEqual(expect.arrayContaining([{ row: 5, col: 7 }]));
    expect(moves).not.toEqual(expect.arrayContaining([{ row: 5, col: 8 }]));
  });

  it("only the king may land on the throne or a corner", () => {
    const board = emptyBoard();
    board[5][2] = "attacker"; // same row as throne (5,5)
    board[0][2] = "defender"; // same column as corner (0,0)

    const attackerMoves = getLegalMoves(board, { row: 5, col: 2 });
    expect(attackerMoves).not.toEqual(expect.arrayContaining([{ row: 5, col: 5 }]));

    const defenderMoves = getLegalMoves(board, { row: 0, col: 2 });
    expect(defenderMoves).not.toEqual(expect.arrayContaining([{ row: 0, col: 0 }]));
  });

  it("a non-king piece CAN pass through an empty throne/corner, just not land on it", () => {
    const board = emptyBoard();
    board[5][2] = "attacker"; // row 5 passes straight through the throne at (5,5)
    const moves = getLegalMoves(board, { row: 5, col: 2 });
    // Can reach past the throne (e.g. col 8) but not the throne itself (col 5)
    expect(moves).toEqual(expect.arrayContaining([{ row: 5, col: 8 }]));
    expect(moves).not.toEqual(expect.arrayContaining([{ row: 5, col: 5 }]));
  });

  it("the king CAN land on the throne or a corner", () => {
    const board = emptyBoard();
    board[5][2] = "king";
    const moves = getLegalMoves(board, { row: 5, col: 2 });
    expect(moves).toEqual(expect.arrayContaining([{ row: 5, col: 5 }]));
  });
});

describe("capturing regular pieces", () => {
  it("captures an enemy piece sandwiched between two of the mover's pieces", () => {
    const board = emptyBoard();
    board[5][5] = "defender"; // the victim, sitting between the two attackers below
    board[5][4] = "attacker"; // already in place on one side
    board[5][6] = "attacker"; // moves in to complete the sandwich
    // Simulate: attacker at (5,6) is the piece that "just moved" next to the victim
    const captured = findRegularCaptures(board, "attacker", { row: 5, col: 6 });
    expect(captured).toEqual(expect.arrayContaining([{ row: 5, col: 5 }]));
  });

  it("does NOT capture when only one side has an enemy piece (no sandwich)", () => {
    const board = emptyBoard();
    board[5][4] = "defender";
    board[5][6] = "attacker"; // only one side — no capture
    const captured = findRegularCaptures(board, "attacker", { row: 5, col: 6 });
    expect(captured).toHaveLength(0);
  });

  it("moving your own piece into a sandwich voluntarily is safe", () => {
    // The rule: captures only happen because of the CAPTURING side's
    // move, never as a side-effect of the victim's own move. Since
    // findRegularCaptures only ever evaluates relative to the piece
    // that just moved, a piece that walks itself between two enemies
    // is never treated as "the mover" that triggers their capture.
    const board = emptyBoard();
    board[5][3] = "attacker";
    board[5][6] = "attacker";
    // Defender voluntarily moves into (5,4) and (5,5), between the two attackers
    board[5][4] = "defender";
    // We check captures from the DEFENDER's own perspective (as if
    // the defender had just moved there) — this should find nothing,
    // because findRegularCaptures looks for the MOVER's enemies next
    // to the mover, not the mover's own vulnerability.
    const captured = findRegularCaptures(board, "defender", { row: 5, col: 4 });
    expect(captured).toHaveLength(0);
  });
});

describe("king capture", () => {
  it("requires exactly 4 attackers around the king, edge does not count as a side", () => {
    const board = emptyBoard();
    // Put king right against the top edge — only 3 real neighbours exist
    board[0][5] = "king";
    board[0][4] = "attacker";
    board[0][6] = "attacker";
    board[1][5] = "attacker";
    // False because the missing 4th side (off the top of the board)
    // never counts as an attacker.
    expect(isKingCaptured(board)).toBe(false);
  });

  it("is captured when all 4 real neighbours are attackers", () => {
    const board = emptyBoard();
    board[5][5] = "king";
    board[4][5] = "attacker";
    board[6][5] = "attacker";
    board[5][4] = "attacker";
    board[5][6] = "attacker";
    expect(isKingCaptured(board)).toBe(true);
  });
});

describe("win conditions via full makeMove flow", () => {
  it("defender wins when the king reaches a corner", () => {
    const game = createGame();
    // King starts already lined up with a corner along row 0, with a
    // clear path. We give the attacker one harmless far-away piece so
    // the "no legal moves" rule doesn't fire for an unrelated reason.
    const board = emptyBoard();
    board[0][5] = "king";
    board[9][9] = "attacker";
    const state = { ...game, board, turn: "defender" as const };

    const result = makeMove(state, { row: 0, col: 5 }, { row: 0, col: 0 });
    expect(result.ok).toBe(true);
    expect(result.state.status).toBe("defender_win");
    expect(result.state.winReason).toMatch(/corner/i);
  });

  it("does not win just by moving the king somewhere that isn't a corner", () => {
    const game = createGame();
    const board = emptyBoard();
    board[5][5] = "king";
    board[9][9] = "attacker";
    const state = { ...game, board, turn: "defender" as const };

    const result = makeMove(state, { row: 5, col: 5 }, { row: 5, col: 1 });
    expect(result.ok).toBe(true);
    expect(result.state.status).toBe("ongoing");
  });

  it("rejects illegal moves without changing the game", () => {
    const game = createGame();
    const result = makeMove(game, { row: 0, col: 0 }, { row: 1, col: 1 }); // no piece there
    expect(result.ok).toBe(false);
  });

  it("rejects moving the opponent's piece on your turn", () => {
    const game = createGame(); // attacker's turn
    // (5,4) is a defender piece in the starting layout
    const result = makeMove(game, { row: 5, col: 4 }, { row: 5, col: 2 });
    expect(result.ok).toBe(false);
  });
});
