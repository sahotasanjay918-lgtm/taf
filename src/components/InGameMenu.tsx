/**
 * InGameMenu.tsx — the hamburger menu shown ONLY on the Game page.
 *
 * This is deliberately a separate component from NavBar.tsx,
 * even though they look almost identical, because their contents
 * are genuinely different: the site-wide menu navigates between
 * pages, while this one controls the game in progress (Resign,
 * Restart, Sound) and neither of those make sense outside a game.
 * Keeping them separate means each file stays simple and it's
 * obvious which one you're editing.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import "./NavBar.css"; // reuses the same visual styling as the site nav

interface InGameMenuProps {
  onResign: () => void;
  onRestart: () => void;
}

export default function InGameMenu({ onResign, onRestart }: InGameMenuProps) {
  const [open, setOpen] = useState(false);
  const openTutorial = useUIStore((s) => s.openTutorial);
  const isSoundOn = useUIStore((s) => s.isSoundOn);
  const toggleSound = useUIStore((s) => s.toggleSound);

  return (
    <header className="taf-navbar">
      <Link to="/" className="taf-navbar__logo">
        TAF
      </Link>

      <button
        type="button"
        className="taf-navbar__menu-button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <nav className="taf-navbar__dropdown" aria-label="Game menu">
          <button
            type="button"
            className="taf-navbar__dropdown-link"
            onClick={() => {
              setOpen(false);
              openTutorial();
            }}
          >
            Tutorial
          </button>
          <button
            type="button"
            className="taf-navbar__dropdown-link"
            onClick={() => {
              setOpen(false);
              onRestart();
            }}
          >
            Restart
          </button>
          <button
            type="button"
            className="taf-navbar__dropdown-link"
            onClick={toggleSound}
          >
            Sound: {isSoundOn ? "On" : "Off"}
          </button>
          <button
            type="button"
            className="taf-navbar__dropdown-link"
            onClick={() => {
              setOpen(false);
              onResign();
            }}
          >
            Resign
          </button>
        </nav>
      )}
    </header>
  );
}
