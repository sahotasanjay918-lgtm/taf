/**
 * Home.tsx — the landing page.
 *
 * Layout (matching your Figma):
 *   1. Nav bar (logo + hamburger menu)
 *   2. "HNEFETAFL / Viking chess" title
 *   3. A static preview of the starting board
 *   4. Tagline
 *   5. Play Now (solid button) -> goes to Pick a Side
 *      Tutorial (outline button) -> opens the tutorial popup
 */
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Board from "../components/Board";
import Button from "../components/Button";
import { createInitialBoard } from "../game/board";
import { useUIStore } from "../store/uiStore";
import { trackEvent } from "../hooks/analytics";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const openTutorial = useUIStore((s) => s.openTutorial);

  // A fixed, non-interactive preview of the starting layout —
  // this never changes, it's purely decorative.
  const previewBoard = createInitialBoard();

  return (
    <div className="taf-home">
      <NavBar />

      <main className="taf-home__content">
        <h1 className="taf-home__title">Hnefetafl</h1>
        <p className="taf-home__subtitle">Viking chess</p>

        <div className="taf-home__board">
          <Board board={previewBoard} interactive={false} />
        </div>

        <p className="taf-home__tagline">
          A historic game of tactics and strategy.
          <br />
          Can you play as the vikings did?
        </p>

        <div className="taf-home__actions">
          <Button
            variant="solid"
            onClick={() => {
              trackEvent("play_now_click");
              navigate("/pick-side");
            }}
          >
            Play now
          </Button>
          <Button variant="outline" onClick={openTutorial}>
            Tutorial
          </Button>
        </div>
      </main>
    </div>
  );
}
