/**
 * DifficultySelector.tsx
 *
 * Visually these are square checkboxes (matching your Figma), but
 * since only one difficulty can ever be active, they behave like
 * radio buttons under the hood — selecting one deselects the
 * other. Confirmed with you earlier.
 */
import "./DifficultySelector.css";

export type Difficulty = "easy" | "hard";

interface DifficultySelectorProps {
  value: Difficulty | null;
  onChange: (value: Difficulty) => void;
}

const OPTIONS: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "hard", label: "Hard" },
];

export default function DifficultySelector({
  value,
  onChange,
}: DifficultySelectorProps) {
  return (
    <div className="taf-difficulty" role="radiogroup" aria-label="Difficulty">
      {OPTIONS.map((option) => {
        const checked = value === option.value;
        return (
          <label className="taf-difficulty__option" key={option.value}>
            <button
              type="button"
              role="radio"
              aria-checked={checked}
              className={`taf-difficulty__box ${checked ? "taf-difficulty__box--checked" : ""}`}
              onClick={() => onChange(option.value)}
            >
              {checked && <span className="taf-difficulty__tick">✓</span>}
            </button>
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
