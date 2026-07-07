/**
 * Board.tsx — draws an 11x11 Hnefetafl board.
 *
 * This is a purely VISUAL component — it has no idea about game
 * rules. It just takes a board (grid of pieces) and draws it,
 * plus optionally highlights squares and reports clicks. This
 * separation means the exact same component can be reused for:
 *   - the real, playable game board
 *   - the small static board previews on the Home/About pages
 *   - the board diagrams inside the tutorial popups
 */
import type { Board as BoardType, Position } from "../game/types";
import "./Board.css";

interface BoardProps {
  board: BoardType;
  /** Optional: called when a square is clicked (only used on the real game board). */
  onSquareClick?: (pos: Position) => void;
  /** Optional: squares to visually highlight, e.g. legal moves or the selected piece. */
  highlighted?: Position[];
  selected?: Position | null;
  /** Set to false to shrink the board for use as a small preview image. */
  interactive?: boolean;
}

function isHighlighted(pos: Position, list: Position[] | undefined) {
  return !!list?.some((p) => p.row === pos.row && p.col === pos.col);
}

export default function Board({
  board,
  onSquareClick,
  highlighted,
  selected,
  interactive = true,
}: BoardProps) {
  return (
    <div
      className={`taf-board ${interactive ? "" : "taf-board--preview"}`}
      role="grid"
      aria-label="Hnefetafl board"
    >
      {board.map((row, rowIndex) => (
        <div className="taf-board__row" role="row" key={rowIndex}>
          {row.map((cell, colIndex) => {
            const pos: Position = { row: rowIndex, col: colIndex };
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const isSelected =
              selected && selected.row === pos.row && selected.col === pos.col;

            return (
              <button
                key={colIndex}
                type="button"
                role="gridcell"
                className={[
                  "taf-board__square",
                  isDark ? "taf-board__square--dark" : "",
                  isHighlighted(pos, highlighted) ? "taf-board__square--highlighted" : "",
                  isSelected ? "taf-board__square--selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onSquareClick?.(pos)}
                disabled={!onSquareClick}
                aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}${
                  cell ? `, ${cell}` : ""
                }`}
              >
                {cell && (
                  <span
                    className={[
                      "taf-piece",
                      `taf-piece--${cell}`,
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {cell === "king" && <span className="taf-piece__king-mark">W</span>}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
