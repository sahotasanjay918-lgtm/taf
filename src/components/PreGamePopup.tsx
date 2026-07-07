/**
 * PreGamePopup.tsx — the "Attack the King!" / "Defend the King!"
 * popup shown right after picking a side.
 *
 * One component handles both variants (the only differences are
 * the title, board preview, and which side the human is playing),
 * rather than duplicating the same popup twice.
 */
import { useState } from "react";
import Popup from "./Popup";
import Board from "./Board";
import Button from "./Button";
import DifficultySelector, { type Difficulty } from "./DifficultySelector";
import {
  createAttackerPreviewBoard,
  createDefenderPreviewBoard,
} from "../game/board";
import type { Player } from "../game/types";
import "./PreGamePopup.css";

interface PreGamePopupProps {
  side: Player;
  onClose: () => void;
  onStartGame: (difficulty: Difficulty) => void;
}

const COPY: Record<Player, { title: string; board: () => ReturnType<typeof createAttackerPreviewBoard> }> = {
  attacker: { title: "Attack the King!", board: createAttackerPreviewBoard },
  defender: { title: "Defend the King!", board: createDefenderPreviewBoard },
};

export default function PreGamePopup({
  side,
  onClose,
  onStartGame,
}: PreGamePopupProps) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const { title, board } = COPY[side];

  return (
    <Popup onClose={onClose} label={title}>
      <h2 className="taf-pregame__title">{title}</h2>

      <div className="taf-pregame__board">
        <Board board={board()} interactive={false} />
      </div>

      <DifficultySelector value={difficulty} onChange={setDifficulty} />

      <Button
        variant="solid"
        disabled={!difficulty}
        onClick={() => difficulty && onStartGame(difficulty)}
      >
        Start game
      </Button>
    </Popup>
  );
}
