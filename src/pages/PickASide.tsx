/**
 * PickASide.tsx — "Pick a side to play".
 *
 * Flow (matching your acceptance criteria):
 *   1. Show the full starting board + Attacker/Defender buttons.
 *   2. Clicking either opens the matching pre-game popup
 *      (PreGamePopup handles both variants).
 *   3. Choosing a difficulty and clicking "Start game" saves both
 *      choices and navigates to the actual game board.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Board from "../components/Board";
import Button from "../components/Button";
import PreGamePopup from "../components/PreGamePopup";
import type { Difficulty } from "../components/DifficultySelector";
import { createInitialBoard } from "../game/board";
import type { Player } from "../game/types";
import { useGameSetupStore } from "../store/gameSetupStore";
import { playSound } from "../hooks/sounds";
import { trackEvent } from "../hooks/analytics";
import "./PickASide.css";

export default function PickASide() {
  const navigate = useNavigate();
  const [openSide, setOpenSide] = useState<Player | null>(null);
  const setHumanSide = useGameSetupStore((s) => s.setHumanSide);
  const setDifficulty = useGameSetupStore((s) => s.setDifficulty);

  const previewBoard = createInitialBoard();

  function handleStartGame(difficulty: Difficulty) {
    if (!openSide) return;
    setHumanSide(openSide);
    setDifficulty(difficulty);
    trackEvent("game_started", { side: openSide, difficulty });
    playSound("gameStart");
    navigate("/game");
  }

  return (
    <div className="taf-pickside">
      <NavBar />

      <main className="taf-pickside__content">
        <h1 className="taf-pickside__title">Pick a side to play</h1>

        <div className="taf-pickside__board">
          <Board board={previewBoard} interactive={false} />
        </div>

        <div className="taf-pickside__actions">
          <Button
            variant="solid"
            onClick={() => {
              trackEvent("side_selected", { side: "attacker" });
              setOpenSide("attacker");
            }}
          >
            Attacker (white)
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              trackEvent("side_selected", { side: "defender" });
              setOpenSide("defender");
            }}
          >
            Defender (black)
          </Button>
        </div>
      </main>

      {openSide && (
        <PreGamePopup
          side={openSide}
          onClose={() => setOpenSide(null)}
          onStartGame={handleStartGame}
        />
      )}
    </div>
  );
}
