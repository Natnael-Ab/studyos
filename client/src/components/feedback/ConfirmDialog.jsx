import { useEffect } from "react";
import { Badge, Button, Surface } from "../ui";
import { useUiFeedback } from "../../hooks/useUiFeedback";

function ConfirmDialog() {
  const { confirmRequest, resolveConfirm } = useUiFeedback();

  useEffect(() => {
    if (!confirmRequest) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        resolveConfirm(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [confirmRequest, resolveConfirm]);

  if (!confirmRequest) {
    return null;
  }

  return (
    <div className="confirm-backdrop" role="presentation">
      <Surface
        as="section"
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <div className="confirm-dialog__header">
          <Badge tone={confirmRequest.tone === "neutral" ? "neutral" : "accent"}>
            Confirmation
          </Badge>
          <button
            type="button"
            className="confirm-dialog__close"
            onClick={() => resolveConfirm(false)}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <h2 id="confirm-dialog-title" className="confirm-dialog__title">
          {confirmRequest.title}
        </h2>
        <p id="confirm-dialog-description" className="confirm-dialog__text">
          {confirmRequest.description}
        </p>

        <div className="confirm-dialog__actions">
          <Button type="button" variant="ghost" onClick={() => resolveConfirm(false)}>
            {confirmRequest.cancelLabel}
          </Button>
          <Button type="button" variant="primary" onClick={() => resolveConfirm(true)}>
            {confirmRequest.confirmLabel}
          </Button>
        </div>
      </Surface>
    </div>
  );
}

export default ConfirmDialog;