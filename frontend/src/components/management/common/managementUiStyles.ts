import type { CSSProperties } from "react";
import { colors, secondaryButtonStyle } from "../../../styles/ui";

export function getManagementActionGroupStyle(
  isVisible: boolean
): CSSProperties {
  return {
    display: "flex",
    gap: "0.45rem",
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? "auto" : "none",
    transition: "opacity 0.15s ease",
  };
}

export const managementListActionButtonStyle: CSSProperties = {
  minHeight: "36px",
  padding: "0.48rem 0.72rem",
  borderRadius: "10px",
  border: `1px solid ${colors.border}`,
  backgroundColor: "#ffffff",
  color: colors.textMuted,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  fontSize: "0.88rem",
  fontWeight: 600,
  cursor: "pointer",
};

export const managementIconOnlyActionStyle: CSSProperties = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  border: `1px solid ${colors.border}`,
  backgroundColor: "#ffffff",
  color: colors.textMuted,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  cursor: "pointer",
};

export const managementCreateButtonStyle: CSSProperties = {
  ...secondaryButtonStyle,
  padding: "0.58rem 0.85rem",
  minHeight: "38px",
  borderRadius: "10px",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
};