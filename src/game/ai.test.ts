import { describe, it, expect } from "vitest";
import { createGame } from "./engine";
import { chooseAiMove } from "./ai";
import { getAllLegalMoves } from "./moves";

describe("AI opponent", () => {
  it("easy difficulty always picks a legal move", () => {
    const game = createGame();
    const move = chooseAiMove(game, "attacker", "easy");
    expect(move).not.toBeNull();

    const legal = getAllLegalMoves(game.board, "attacker");
    const isLegal = legal.some(
      (m) =>
        m.from.row === move!.from.row &&
        m.from.col === move!.from.col &&
        m.to.row === move!.to.row &&
        m.to.col === move!.to.col
    );
    expect(isLegal).toBe(true);
  });

  it("hard difficulty always picks a legal move", () => {
    const game = createGame();
    const move = chooseAiMove(game, "attacker", "hard");
    expect(move).not.toBeNull();

    const legal = getAllLegalMoves(game.board, "attacker");
    const isLegal = legal.some(
      (m) =>
        m.from.row === move!.from.row &&
        m.from.col === move!.from.col &&
        m.to.row === move!.to.row &&
        m.to.col === move!.to.col
    );
    expect(isLegal).toBe(true);
  });

  it("hard difficulty takes a free capture when one is available", () => {
    // Build a scenario with an obvious, immediate capture available
    // to the attacker, and confirm the "hard" AI actually takes it
    // rather than doing something else.
    const board = Array.from({ length: 11 }, () =>
      Array.from({ length: 11 }, () => null as null | "attacker" | "defender" | "king")
    );
    board[5][5] = "defender"; // a lone, undefended defender
    board[5][4] = "attacker"; // already sandwiching from the left
    board[3][6] = "attacker"; // can move down to (5,6) to complete the sandwich
    // King placed safely in the middle of the board — NOT on or
    // able to reach a corner in one move, so this test only
    // measures whether the AI prioritises the free capture rather
    // than being decided by an unrelated king escape.
    board[8][8] = "king";

    const state = {
      board,
      turn: "attacker" as const,
      status: "ongoing" as const,
      winReason: "",
      positionHistory: [],
    };

    const move = chooseAiMove(state, "attacker", "hard");
    expect(move).toEqual({ from: { row: 3, col: 6 }, to: { row: 5, col: 6 } });
  });
});
