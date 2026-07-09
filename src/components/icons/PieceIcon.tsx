/**
 * PieceIcon.tsx — renders your exact piece SVGs.
 *
 * These match the SVG files you sent over precisely: a solid
 * background circle, a thin opposite-colour stroke ring in the
 * middle, and (for the king only) a small crown shape underneath
 * that ring.
 *
 * Colours are wired to the shared theme tokens (theme.css) rather
 * than hardcoded, so if you ever change --color-white/black/light
 * site-wide, these pieces update automatically along with
 * everything else.
 */
import type { PieceType } from "../../game/types";

interface PieceIconProps {
  type: PieceType;
  className?: string;
}

export default function PieceIcon({ type, className }: PieceIconProps) {
  if (type === "attacker") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="var(--color-white)" />
        <circle
          cx="12"
          cy="12"
          r="8.11176"
          fill="none"
          stroke="var(--color-black)"
        />
      </svg>
    );
  }

  if (type === "defender") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="var(--color-black)" />
        <circle
          cx="12"
          cy="12"
          r="8.11176"
          fill="none"
          stroke="var(--color-white)"
        />
      </svg>
    );
  }

  // king
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="var(--color-black)" />
      <path
        d="M14.3022 12L16.3765 7.52832V15.249H7.90576V7.52637L9.97998 11.999L12.1411 7.34082L14.3022 12Z"
        fill="var(--color-light)"
      />
      <circle
        cx="12"
        cy="12"
        r="8.11176"
        fill="none"
        stroke="var(--color-white)"
      />
    </svg>
  );
}
