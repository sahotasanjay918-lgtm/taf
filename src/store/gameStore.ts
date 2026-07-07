/**
 * gameStore.ts — the "brain" behind the actual playable game page.
 *
 * This is the bridge between the game engine (src/game/) and the
 * UI. It holds:
 *   - the current GameState (board, turn, win/lose status)
 *   - which square is currently selected, and its legal moves
 *   - logic for "it's the AI's turn, so make its move automatically"
 *
 * The Game page component just reads from this store and calls
 * its actions — it doesn't need to know any rules itself.
 */
import { create } from "zustand";
import type { GameState, Player, Position } from "../game/types";
import { createGame, makeMove } from "../game/engine";
import { getLegalMoves } from "../game/moves";
import { chooseAiMove, type Difficulty } from "../game/ai";
import { playSound } from "../hooks/sounds";

interface GameStoreState {
  game: GameState;
  humanSide: Player;
  difficulty: Difficulty;
  selected: Position | null;
  legalMovesForSelected: Position[];
  /** True while the AI is "thinking" — used to silently disable the board. */
  isAiTurn: boolean;

  startNewGame: (humanSide: Player, difficulty: Difficulty) => void;
  selectSquare: (pos: Position) => void;
  resign: () => void;
}

function opponentOf(player: Player): Player {
  return player === "attacker" ? "defender" : "attacker";
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  game: createGame(),
  humanSide: "attacker",
  difficulty: "easy",
  selected: null,
  legalMovesForSelected: [],
  isAiTurn: false,

  startNewGame: (humanSide, difficulty) => {
    const game = createGame();
    set({
      game,
      humanSide,
      difficulty,
      selected: null,
      legalMovesForSelected: [],
      isAiTurn: game.turn !== humanSide,
    });
    // If the human chose to play defender, the attacker (AI) still
    // moves first — trigger that immediately.
    if (game.turn !== humanSide) {
      runAiTurn();
    }
  },

  selectSquare: (pos) => {
    const { game, humanSide, selected, legalMovesForSelected, isAiTurn } = get();
    if (game.status !== "ongoing" || isAiTurn) return;
    if (game.turn !== humanSide) return; // not the human's turn

    // Clicking one of the highlighted legal-move squares -> make the move.
    const isLegalTarget = legalMovesForSelected.some(
      (m) => m.row === pos.row && m.col === pos.col
    );
    if (selected && isLegalTarget) {
      const result = makeMove(game, selected, pos);
      if (result.ok) {
        set({ game: result.state, selected: null, legalMovesForSelected: [] });
        if (result.state.status === "ongoing" && result.state.turn !== humanSide) {
          set({ isAiTurn: true });
          runAiTurn();
        }
      }
      return;
    }

    // Otherwise, treat this as selecting (or re-selecting) a piece.
    const piece = game.board[pos.row][pos.col];
    const pieceOwner: Player | null =
      piece === null ? null : piece === "attacker" ? "attacker" : "defender";

    if (pieceOwner === humanSide) {
      playSound("select");
      set({
        selected: pos,
        legalMovesForSelected: getLegalMoves(game.board, pos),
      });
    } else {
      set({ selected: null, legalMovesForSelected: [] });
    }
  },

  resign: () => {
    const { game, humanSide } = get();
    if (game.status !== "ongoing") return;
    const winner = opponentOf(humanSide);
    set({
      game: {
        ...game,
        status: winner === "attacker" ? "attacker_win" : "defender_win",
        winReason: "You resigned.",
      },
      selected: null,
      legalMovesForSelected: [],
    });
  },
}));

/**
 * Runs the AI's move after a short, natural-feeling pause.
 * The board is already disabled via isAiTurn while this happens.
 */
function runAiTurn() {
  setTimeout(() => {
    const { game, humanSide, difficulty, isAiTurn } = useGameStore.getState();
    if (game.status !== "ongoing") {
      useGameStore.setState({ isAiTurn: false });
      return;
    }
    if (game.turn === humanSide) {
      useGameStore.setState({ isAiTurn: false });
      return;
    }
    if (!isAiTurn) return;

    const aiMove = chooseAiMove(game, game.turn, difficulty);
    if (!aiMove) {
      useGameStore.setState({ isAiTurn: false });
      return;
    }

    const result = makeMove(game, aiMove.from, aiMove.to);
    if (result.ok) {
      useGameStore.setState({ game: result.state });
    }

    // If it's STILL not the human's turn afterwards (shouldn't
    // normally happen, since players alternate), keep going;
    // otherwise hand control back to the human.
    const stillAiTurn =
      result.ok && result.state.status === "ongoing" && result.state.turn !== humanSide;
    useGameStore.setState({ isAiTurn: stillAiTurn });
    if (stillAiTurn) runAiTurn();
  }, 400);
}
