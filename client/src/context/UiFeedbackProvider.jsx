import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import UiFeedbackContext from "./UiFeedbackContext";

function createId(prefix) {
  const randomId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(16).slice(2);

  return `${prefix}-${randomId}`;
}

function UiFeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [confirmRequest, setConfirmRequest] = useState(null);
  const toastTimersRef = useRef(new Map());
  const confirmResolverRef = useRef(null);

  useEffect(() => {
    const timers = toastTimersRef.current;

    return () => {
      for (const timerId of timers.values()) {
        window.clearTimeout(timerId);
      }

      timers.clear();
      confirmResolverRef.current = null;
    };
  }, []);

  const dismissToast = useCallback((toastId) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));

    const timerId = toastTimersRef.current.get(toastId);
    if (timerId) {
      window.clearTimeout(timerId);
      toastTimersRef.current.delete(toastId);
    }
  }, []);

  const pushToast = useCallback(
    ({ title, message, tone = "neutral", timeout = 4200 }) => {
      const toastId = createId("toast");

      setToasts((current) => [
        {
          id: toastId,
          title: typeof title === "string" ? title : "Notice",
          message: typeof message === "string" ? message : "",
          tone
        },
        ...current
      ].slice(0, 4));

      const timerId = window.setTimeout(() => {
        dismissToast(toastId);
      }, timeout);

      toastTimersRef.current.set(toastId, timerId);

      return toastId;
    },
    [dismissToast]
  );

  const confirm = useCallback(
    (options = {}) =>
      new Promise((resolve) => {
        confirmResolverRef.current = resolve;

        setConfirmRequest({
          id: createId("confirm"),
          title: typeof options.title === "string" ? options.title : "Confirm action",
          description:
            typeof options.description === "string"
              ? options.description
              : "Please confirm this action.",
          confirmLabel:
            typeof options.confirmLabel === "string" ? options.confirmLabel : "Confirm",
          cancelLabel:
            typeof options.cancelLabel === "string" ? options.cancelLabel : "Cancel",
          tone: options.tone === "neutral" ? "neutral" : "accent"
        });
      }),
    []
  );

  const resolveConfirm = useCallback((result) => {
    const resolver = confirmResolverRef.current;
    confirmResolverRef.current = null;

    if (resolver) {
      resolver(result);
    }

    setConfirmRequest(null);
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      confirmRequest,
      pushToast,
      dismissToast,
      confirm,
      resolveConfirm
    }),
    [confirm, confirmRequest, dismissToast, pushToast, resolveConfirm, toasts]
  );

  return <UiFeedbackContext.Provider value={value}>{children}</UiFeedbackContext.Provider>;
}

export default UiFeedbackProvider;