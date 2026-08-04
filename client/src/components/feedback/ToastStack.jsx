import { Badge, Surface } from "../ui";
import { useUiFeedback } from "../../hooks/useUiFeedback";

function ToastStack() {
  const { toasts, dismissToast } = useUiFeedback();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <Surface key={toast.id} className="toast-card">
          <div className="toast-card__header">
            <Badge tone={toast.tone === "neutral" ? "neutral" : "accent"}>
              {toast.tone === "accent" ? "Update" : "Notice"}
            </Badge>

            <button
              type="button"
              className="toast-card__close"
              onClick={() => dismissToast(toast.id)}
              aria-label={`Dismiss ${toast.title}`}
            >
              ×
            </button>
          </div>

          <strong className="toast-card__title">{toast.title}</strong>
          {toast.message ? <p className="toast-card__text">{toast.message}</p> : null}
        </Surface>
      ))}
    </div>
  );
}

export default ToastStack;