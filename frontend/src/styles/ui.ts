import type { CSSProperties } from "react";

export const colors = {
  background: "#f8fafc",
  surface: "#ffffff",
  surfaceSoft: "#f8fafc",
  border: "#e5e7eb",
  borderStrong: "#d1d5db",
  text: "#111827",
  textMuted: "#6b7280",
  primary: "#2563eb",
  primarySoft: "#eff6ff",
  accent: "#7c3aed",
  danger: "#b91c1c",
  dangerSoft: "#fef2f2",
};

export const pageContainerStyle: CSSProperties = {
  width: "100%",
  maxWidth: "980px",
  margin: "0 auto",
  padding: "0",
  color: colors.text,
};

export const contentCardStyle: CSSProperties = {
  marginTop: "1.5rem",
  border: `1px solid ${colors.border}`,
  borderRadius: "18px",
  padding: "1.5rem",
  backgroundColor: colors.surface,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
};

export const clickableCardStyle: CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "inherit",
  border: `1px solid ${colors.border}`,
  borderRadius: "16px",
  padding: "1rem 1.1rem",
  backgroundColor: colors.surface,
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
  transition:
    "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease, background-color 0.15s ease",
};

export const sectionTitleStyle: CSSProperties = {
  margin: "0 0 0.5rem 0",
  fontSize: "1.9rem",
  lineHeight: 1.2,
  fontWeight: 800,
  color: colors.text,
};

export const sectionDescriptionStyle: CSSProperties = {
  margin: 0,
  color: colors.textMuted,
  lineHeight: 1.6,
  fontSize: "1rem",
};

export const badgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.4rem 0.75rem",
  borderRadius: "999px",
  backgroundColor: colors.primarySoft,
  color: colors.primary,
  fontWeight: 700,
  fontSize: "0.95rem",
  whiteSpace: "nowrap",
};

export const subtleLabelStyle: CSSProperties = {
  fontSize: "0.9rem",
  color: colors.textMuted,
  marginBottom: "0.2rem",
};

export function applyClickableCardHover(element: HTMLElement) {
  element.style.transform = "translateY(-2px)";
  element.style.boxShadow = "0 12px 28px rgba(15, 23, 42, 0.10)";
  element.style.borderColor = colors.borderStrong;
  element.style.backgroundColor = "#fcfcfd";
}

export function resetClickableCardHover(element: HTMLElement) {
  element.style.transform = "translateY(0)";
  element.style.boxShadow = "0 2px 8px rgba(15, 23, 42, 0.04)";
  element.style.borderColor = colors.border;
  element.style.backgroundColor = colors.surface;
}