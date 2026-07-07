/**
 * Popup.tsx — the shared popup "shell" used everywhere.
 *
 * Every popup in your designs (pre-game difficulty, win/lose,
 * tutorial) has the same bones: a dark rounded panel, centred on
 * screen, with an X in the top-right that closes it. Rather than
 * rebuild that each time, every popup in the app wraps its own
 * content in THIS component.
 *
 * Acceptance criteria this satisfies:
 *   "GIVEN I can see any pop up, WHEN I click 'x', THEN close the pop up"
 */
import type { ReactNode } from "react";
import "./Popup.css";

interface PopupProps {
  onClose: () => void;
  children: ReactNode;
  /** For screen readers — describes what this popup is. */
  label: string;
}

export default function Popup({ onClose, children, label }: PopupProps) {
  return (
    <div className="taf-popup-overlay" role="presentation">
      <div
        className="taf-popup"
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <button
          type="button"
          className="taf-popup__close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
