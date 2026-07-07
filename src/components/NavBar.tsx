/**
 * NavBar.tsx — the "TAF" logo + hamburger menu shown on every page.
 *
 * This is the SITE-WIDE version (Home, Play Hnefetafl, Tutorial,
 * About, Contact). The in-game version, with Resign/Restart/Sound
 * instead, is a separate component built later alongside the Game
 * page — see the README for why they're split.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useUIStore } from "../store/uiStore";
import "./NavBar.css";

const SITE_LINKS = [
  { label: "Home", to: "/" },
  { label: "Play Hnefetafl", to: "/pick-side" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const openTutorial = useUIStore((s) => s.openTutorial);

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
        <nav className="taf-navbar__dropdown" aria-label="Site navigation">
          {/* First link renders, then Tutorial is inserted in its
              correct position (matching the Figma menu order) as a
              button rather than a page link, since it opens a popup
              instead of navigating anywhere. */}
          <Link to={SITE_LINKS[0].to} onClick={() => setOpen(false)}>
            {SITE_LINKS[0].label}
          </Link>
          <Link to={SITE_LINKS[1].to} onClick={() => setOpen(false)}>
            {SITE_LINKS[1].label}
          </Link>
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
          {SITE_LINKS.slice(2).map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
