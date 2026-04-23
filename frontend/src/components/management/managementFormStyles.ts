import type { CSSProperties } from "react";
import { colors } from "../../styles/ui";

export const managementFormStyle: CSSProperties = {
  display: "grid",
  gap: "1.1rem",
};

export const managementFormHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  flexWrap: "wrap",
};

export const managementFormTitleStyle: CSSProperties = {
  margin: 0,
  fontSize: "1.05rem",
  fontWeight: 800,
  color: colors.text,
};

export const managementFormDescriptionStyle: CSSProperties = {
  margin: "0.35rem 0 0 0",
  color: colors.textMuted,
  lineHeight: 1.5,
  fontSize: "0.95rem",
};

export const managementSelectedInfoStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.85rem",
  padding: "0.9rem",
  borderRadius: "14px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
};

export const managementSelectedBadgeStyle: CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  border: `1px solid ${colors.borderStrong}`,
  background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
  color: colors.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: "0.95rem",
  flexShrink: 0,
};

export const managementSelectedNameStyle: CSSProperties = {
  color: colors.text,
  fontWeight: 700,
};

export const managementSelectedMetaStyle: CSSProperties = {
  marginTop: "0.2rem",
  color: colors.textMuted,
  fontSize: "0.88rem",
  lineHeight: 1.5,
};

export const managementFormGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1rem",
};

export const managementFormHintStyle: CSSProperties = {
  margin: 0,
  color: colors.textMuted,
  fontSize: "0.92rem",
  lineHeight: 1.55,
};

export const managementFormActionsWrapperStyle: CSSProperties = {
  display: "grid",
  gap: "0.9rem",
};

export const managementFormCenteredActionsStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "0.65rem",
  flexWrap: "wrap",
};

export const managementFormDangerRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

export const managementFormCompactPrimaryButtonStyle: CSSProperties = {
  minHeight: "40px",
  padding: "0.62rem 0.95rem",
  borderRadius: "10px",
};

export const managementFormCompactSecondaryButtonStyle: CSSProperties = {
  minHeight: "40px",
  padding: "0.62rem 0.95rem",
  borderRadius: "10px",
};

export const managementFormDangerButtonStyle: CSSProperties = {
  minHeight: "42px",
  padding: "0.62rem 1rem",
  borderRadius: "10px",
  border: "1px solid #fecaca",
  backgroundColor: colors.dangerSoft,
  color: colors.danger,
  fontWeight: 700,
};