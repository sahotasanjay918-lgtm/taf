/**
 * ResultPopup.tsx — the "You win!" / "You lost" popup.
 *
 * Shown whenever the game's status stops being "ongoing". Which
 * message is shown depends on whether the WINNING side matches
 * the side the human picked at the start.
 */
import { useNavigate } from "react-router-dom";
import Popup from "./Popup";
import Button from "./Button";
import type { Player } from "../game/types";
import "./ResultPopup.css";

interface ResultPopupProps {
  didHumanWin: boolean;
  humanSide: Player;
  onPlayAgain: () => void;
}

export default function ResultPopup({
  didHumanWin,
  onPlayAgain,
}: ResultPopupProps) {
  const navigate = useNavigate();

  return (
    <Popup onClose={() => navigate("/")} label={didHumanWin ? "You win" : "You lost"}>
      <h2 className="taf-result__title">{didHumanWin ? "You win!" : "You lost"}</h2>
      <p className="taf-result__tagline">
        {didHumanWin
          ? "What a crushing victory! Would you like to play again?"
          : "Would a real viking give up after a loss? Try again!"}
      </p>
      <div className="taf-result__actions">
        <Button variant="outline" onClick={() => navigate("/")}>
          Home
        </Button>
        <Button variant="solid" onClick={onPlayAgain}>
          Play again
        </Button>
      </div>
    </Popup>
  );
}
