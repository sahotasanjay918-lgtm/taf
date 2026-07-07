/**
 * gameSetupStore.ts — remembers the choices made on the way into
 * a game: which side the human is playing, and what difficulty.
 *
 * Why this exists: "Pick a Side" and the difficulty popup are on
 * one page, but the actual board is on another page (/game). This
 * store carries those two choices across that page change, since
 * React doesn't otherwise remember anything between pages.
 */
import { create } from "zustand";
import type { Player } from "../game/types";
import type { Difficulty } from "../components/DifficultySelector";

interface GameSetupState {
  humanSide: Player | null;
  difficulty: Difficulty | null;
  setHumanSide: (side: Player) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  reset: () => void;
}

export const useGameSetupStore = create<GameSetupState>((set) => ({
  humanSide: null,
  difficulty: null,
  setHumanSide: (side) => set({ humanSide: side }),
  setDifficulty: (difficulty) => set({ difficulty }),
  reset: () => set({ humanSide: null, difficulty: null }),
}));
