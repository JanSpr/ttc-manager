import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { colors } from "../styles/ui";
import { ToastContext, type ToastItem, type ToastType } from "./ToastContext";

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(1);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = nextIdRef.current++;
      const toast: ToastItem = { id, message, type };

      setToasts((current) => [...current, toast]);

      window.setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
    }),
    [toasts, showToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        style={{
          position: "fixed",
          left: "50%",
          bottom: "22px",
          transform: "translateX(-50%)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          pointerEvents: "none",
          width: "min(92vw, 420px)",
          alignItems: "stretch",
        }}
      >
        {toasts.map((toast) => {
          const tone =
            toast.type === "success"
              ? {
                  backgroundColor: colors.primarySoft,
                  borderColor: "#bfdbfe",
                  textColor: colors.primary,
                }
              : toast.type === "error"
              ? {
                  backgroundColor: colors.dangerSoft,
                  borderColor: "#fecaca",
                  textColor: colors.danger,
                }
              : {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  textColor: colors.text,
                };

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: "auto",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "0.9rem 1rem",
                borderRadius: "14px",
                border: `1px solid ${tone.borderColor}`,
                backgroundColor: tone.backgroundColor,
                color: tone.textColor,
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
              }}
            >
              <div
                style={{
                  flex: 1,
                  fontWeight: 600,
                  lineHeight: 1.45,
                }}
              >
                {toast.message}
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Meldung schließen"
                style={{
                  border: "none",
                  background: "transparent",
                  color: tone.textColor,
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;