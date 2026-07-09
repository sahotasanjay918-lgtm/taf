/**
 * ConfirmDialog.tsx — a generic "are you sure?" popup.
 *
 * Built on top of the shared Popup component so it looks
 * consistent with every other popup in the app. Reusable for any
 * future "this can't be undone" action, not just resigning.
 */
import Popup from "./Popup";
import Button from "./Button";
import "./ConfirmDialog.css";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Yes",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Popup onClose={onCancel} label={title}>
      <h2 className="taf-confirm__title">{title}</h2>
      <p className="taf-confirm__message">{message}</p>
      <div className="taf-confirm__actions">
        <Button variant="outline" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant="solid" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Popup>
  );
}
