/**
 * MovementDiagram.tsx — the "pieces move up/down/left/right, any
 * distance" illustration from your Figma tutorial popup 2.
 *
 * This is a one-off visual, not reused elsewhere, so it's kept
 * simple as a small inline SVG rather than trying to force it
 * through the Board component (which only knows how to draw
 * pieces, not arrows).
 */
import "./MovementDiagram.css";

export default function MovementDiagram() {
  return (
    <div className="taf-movement-diagram">
      <svg viewBox="0 0 200 200" className="taf-movement-diagram__svg">
        <line x1="100" y1="100" x2="100" y2="20" className="taf-movement-diagram__arrow" />
        <polygon points="100,10 92,26 108,26" className="taf-movement-diagram__head" />

        <line x1="100" y1="100" x2="100" y2="180" className="taf-movement-diagram__arrow" />
        <polygon points="100,190 92,174 108,174" className="taf-movement-diagram__head" />

        <line x1="100" y1="100" x2="20" y2="100" className="taf-movement-diagram__arrow" />
        <polygon points="10,100 26,92 26,108" className="taf-movement-diagram__head" />

        <line x1="100" y1="100" x2="180" y2="100" className="taf-movement-diagram__arrow" />
        <polygon points="190,100 174,92 174,108" className="taf-movement-diagram__head" />

        <circle cx="100" cy="100" r="10" className="taf-movement-diagram__center" />
        <circle cx="100" cy="100" r="4" className="taf-movement-diagram__center-dot" />
      </svg>
    </div>
  );
}
