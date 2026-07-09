/**
 * Game.tsx — the actual playable board.
 *
 * On arrival, this page reads the side/difficulty chosen on the
 * "Pick a Side" page (via gameSetupStore) and starts a fresh game.
 * From there, all the real logic lives in gameStore.ts — this
 * component just displays whatever that store says the current
 * state is, and forwards clicks/button-presses to it.
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InGameMenu from "../components/InGameMenu";
import Board from "../components/Board";
import Button from "../components/Button";
import ResultPopup from "../components/ResultPopup";
import ConfirmDialog from "../components/ConfirmDialog";
import { useGameStore } from "../store/gameStore";
import { useGameSetupStore } from "../store/gameSetupStore";
import { useUIStore } from "../store/uiStore";
import { playSound } from "../hooks/sounds";
import { trackEvent } from "../hooks/analytics";
import "./Game.css";

export default function Game() {
  const navigate = useNavigate();
  const humanSide = useGameSetupStore((s) => s.humanSide);
  const difficulty = useGameSetupStore((s) => s.difficulty);
  const openTutorial = useUIStore((s) => s.openTutorial);

  const game = useGameStore((s) => s.game);
  const selected = useGameStore((s) => s.selected);
  const legalMovesForSelected = useGameStore((s) => s.legalMovesForSelected);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const selectSquare = useGameStore((s) => s.selectSquare);
  const resign = useGameStore((s) => s.resign);

  // Resigning is permanent, so both the bottom button and the menu
  // item open this confirmation instead of resigning immediately.
  const [isResignConfirmOpen, setIsResignConfirmOpen] = useState(false);

  // If someone lands on /game directly without picking a side
  // first, send them back — there's nothing to play yet.
  useEffect(() => {
    if (!humanSide || !difficulty) {
      navigate("/pick-side");
      return;
    }
    startNewGame(humanSide, difficulty);
    // Only run this on the very first arrival at the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const didHumanWin =
    (game.status === "attacker_win" && humanSide === "attacker") ||
    (game.status === "defender_win" && humanSide === "defender");

  // Play the win/lose sound exactly once, the moment the game
  // actually ends (covers normal wins/losses AND resigning, since
  // resigning just sets the same status under the hood).
  const previousStatusRef = useRef(game.status);
  useEffect(() => {
    if (game.status !== "ongoing" && previousStatusRef.current === "ongoing") {
      playSound(didHumanWin ? "win" : "lose");
      trackEvent("game_ended", {
        result: didHumanWin ? "win" : "lose",
        reason: game.winReason,
        side: humanSide,
        difficulty,
      });
    }
    previousStatusRef.current = game.status;
  }, [game.status, didHumanWin, game.winReason, humanSide, difficulty]);

  // IMPORTANT: this early return must come AFTER every hook above,
  // never before — React requires the same hooks to run, in the
  // same order, on every render of this component.
  if (!humanSide || !difficulty) return null;

  return (
    <div className="taf-game">
      <InGameMenu
        onResign={() => setIsResignConfirmOpen(true)}
        onRestart={() => startNewGame(humanSide, difficulty)}
      />

      <main className="taf-game__content">
        <h1 className="taf-game__title">
          Fram! <span className="taf-game__title-sub">(Forward!)</span>
        </h1>

        <div className="taf-game__board">
          <Board
            board={game.board}
            onSquareClick={(pos) => selectSquare(pos)}
            selected={selected}
            highlighted={legalMovesForSelected}
          />
        </div>

        <div className="taf-game__actions">
          <Button variant="outline" onClick={openTutorial}>
            Tutorial
          </Button>
          <Button variant="outline" onClick={() => setIsResignConfirmOpen(true)}>
            Resign
          </Button>
        </div>
      </main>

      {isResignConfirmOpen && (
        <ConfirmDialog
          title="Resign?"
          message="Are you sure you want to resign? This will end the game and count as a loss."
          confirmLabel="Yes, resign"
          cancelLabel="Keep playing"
          onConfirm={() => {
            setIsResignConfirmOpen(false);
            resign();
          }}
          onCancel={() => setIsResignConfirmOpen(false)}
        />
      )}

      {game.status !== "ongoing" && (
        <ResultPopup
          didHumanWin={didHumanWin}
          humanSide={humanSide}
          onPlayAgain={() => startNewGame(humanSide, difficulty)}
        />
      )}
    </div>
  );
}
