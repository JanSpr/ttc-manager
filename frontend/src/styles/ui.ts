import type { CSSProperties } from "react";

export const pageContainerStyle: CSSProperties = {
  padding: "2rem",
  maxWidth: "900px",
  margin: "0 auto",
  fontFamily: "Arial, sans-serif",
};

export const contentCardStyle: CSSProperties = {
  marginTop: "1.5rem",
  border: "1px solid #d0d7de",
  borderRadius: "10px",
  padding: "1.25rem",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
  backgroundColor: "#ffffff",
};

export const clickableCardStyle: CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "inherit",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "0.9rem 1rem",
  backgroundColor: "#fafafa",
  transition:
    "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
};

export function applyClickableCardHover(element: HTMLElement) {
  element.style.transform = "translateY(-2px)";
  element.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
  element.style.borderColor = "#cbd5e1";
}

export function resetClickableCardHover(element: HTMLElement) {
  element.style.transform = "translateY(0)";
  element.style.boxShadow = "none";
  element.style.borderColor = "#e5e7eb";
}
