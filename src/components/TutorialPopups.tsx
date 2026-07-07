/**
 * TutorialPopups.tsx — the 6-step "how to play" walkthrough.
 *
 * This renders globally (mounted once in App.tsx) rather than on
 * any one page, since the tutorial can be opened from the Home
 * page, the Game page, or the site menu — see uiStore.ts for how
 * that shared open/closed state works.
 *
 * Navigation rules (from the acceptance criteria):
 *   - "Next" moves forward a step
 *   - "Back" moves back a step, EXCEPT on step 1, where it closes
 *     the tutorial entirely
 *   - "Done" (only shown on the last step) closes the tutorial
 */
import { useState } from "react";
import Popup from "./Popup";
import Board from "./Board";
import Button from "./Button";
import MovementDiagram from "./MovementDiagram";
import {
  createInitialBoard,
  createEmptyBoard,
  createKingSurroundedDemoBoard,
  createCaptureDemoBoard,
  CORNERS,
} from "../game/board";
import { useUIStore } from "../store/uiStore";
import { trackEvent } from "../hooks/analytics";
import "./TutorialPopups.css";

interface Step {
  title: string;
  visual: React.ReactNode;
  body: React.ReactNode;
}

const STEPS: Step[] = [
  {
    title: "Tutorial",
    visual: <Board board={createInitialBoard()} interactive={false} />,
    body: (
      <>
        <p>Hnefetafl is a board game.</p>
        <p>It's like chess, but with different:</p>
        <ul>
          <li>Pieces</li>
          <li>Setup</li>
          <li>Goals</li>
          <li>Capturing</li>
        </ul>
      </>
    ),
  },
  {
    title: "Tutorial",
    visual: <MovementDiagram />,
    body: (
      <>
        <p>The pieces move:</p>
        <ul>
          <li>Up, down, left and right</li>
          <li>Any distance</li>
        </ul>
      </>
    ),
  },
  {
    title: "Game objectives",
    visual: (
      <Board board={createEmptyBoard()} interactive={false} highlighted={[CORNERS[1]]} />
    ),
    body: (
      <>
        <p>Each side is different.</p>
        <p>The defender wins by:</p>
        <ul>
          <li>Getting the king to any corner of the board.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Game objectives",
    visual: <Board board={createKingSurroundedDemoBoard()} interactive={false} />,
    body: (
      <>
        <p>Each side is different.</p>
        <p>
          The attacker wins by <u>either</u>:
        </p>
        <ul>
          <li>Surrounding the king (as above)</li>
          <li>Exhausting the defender's possible moves</li>
        </ul>
      </>
    ),
  },
  {
    title: "Capturing",
    visual: <Board board={createCaptureDemoBoard()} interactive={false} />,
    body: (
      <>
        <p>
          Put 2 pieces either side of an enemy piece to capture (left/right{" "}
          <u>or</u> top/bottom work)
        </p>
        <p>
          You can put a piece between two enemy pieces — this won't{" "}
          <u>'self-remove'</u> your piece.
        </p>
      </>
    ),
  },
  {
    title: "One last caveat!",
    visual: <Board board={createInitialBoard()} interactive={false} />,
    body: (
      <>
        <p>Many variations exist of the game.</p>
        <p>Apologies if you use other rules!</p>
      </>
    ),
  },
];

export default function TutorialPopups() {
  const isOpen = useUIStore((s) => s.isTutorialOpen);
  const closeTutorial = useUIStore((s) => s.closeTutorial);
  const [stepIndex, setStepIndex] = useState(0);

  if (!isOpen) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === STEPS.length - 1;
  const step = STEPS[stepIndex];

  function handleClose(completed: boolean) {
    trackEvent("tutorial_closed", { completed, stepReached: stepIndex + 1 });
    setStepIndex(0); // reset so it starts from the beginning next time
    closeTutorial();
  }

  function handleBack() {
    if (isFirst) {
      handleClose(false);
    } else {
      setStepIndex((i) => i - 1);
    }
  }

  function handleNext() {
    if (isLast) {
      handleClose(true);
    } else {
      setStepIndex((i) => i + 1);
    }
  }

  return (
    <Popup onClose={() => handleClose(false)} label={step.title}>
      <h2 className="taf-tutorial__title">{step.title}</h2>

      <div className="taf-tutorial__visual">{step.visual}</div>

      <div className="taf-tutorial__body">{step.body}</div>

      <div className="taf-tutorial__actions">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button variant="solid" onClick={handleNext}>
          {isLast ? "Done" : "Next"}
        </Button>
      </div>
    </Popup>
  );
}
