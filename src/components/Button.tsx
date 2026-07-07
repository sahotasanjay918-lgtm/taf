/**
 * Button.tsx — the two button styles from your Figma components:
 *   - "solid": filled background (used for the main action, e.g. Play Now)
 *   - "outline": just a border (used for secondary actions, e.g. Tutorial)
 */
import type { ButtonHTMLAttributes } from "react";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
}

export default function Button({
  variant = "outline",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={["taf-button", `taf-button--${variant}`, className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
