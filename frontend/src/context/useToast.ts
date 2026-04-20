import { useContext } from "react";
import { ToastContext } from "./ToastContext";

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast muss innerhalb eines ToastProvider verwendet werden.");
  }

  return context;
}