import type { ReactNode } from "react";
import { badgeStyle, colors } from "../../styles/ui";

type EditorSectionProps = {
  title: string;
  actionLabel: string;
  actionIcon?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  collapsedHint: string;
  children: ReactNode;
};

function EditorSection({
  title,
  actionLabel,
  actionIcon,
  isOpen,
  onToggle,
  collapsedHint,
  children,
}: EditorSectionProps) {
  return (
    <section style={sectionCardStyle}>
      <div style={sectionHeaderRowStyle}>
        <div style={sectionHeaderTextStyle}>
          <div style={sectionBadgeRowStyle}>
            <span style={badgeStyle}>{title}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          style={sectionActionButtonStyle}
          aria-expanded={isOpen}
        >
          <span style={buttonIconTextRowStyle}>
            {actionIcon}
            <span>{actionLabel}</span>
          </span>
        </button>
      </div>

      {isOpen ? (
        <div style={sectionContentStyle}>{children}</div>
      ) : (
        <div style={sectionCollapsedHintStyle}>{collapsedHint}</div>
      )}
    </section>
  );
}

const sectionCardStyle = {
  display: "grid",
  gap: "0.9rem",
  padding: "1rem",
  borderRadius: "16px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
};

const sectionHeaderRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  flexWrap: "wrap" as const,
};

const sectionHeaderTextStyle = {
  minWidth: 0,
  flex: 1,
};

const sectionBadgeRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const sectionActionButtonStyle = {
  minHeight: "38px",
  padding: "0.55rem 0.8rem",
  borderRadius: "10px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
  color: colors.text,
  fontWeight: 700,
  cursor: "pointer",
  flexShrink: 0,
};

const sectionContentStyle = {
  display: "grid",
  gap: "1rem",
};

const sectionCollapsedHintStyle = {
  padding: "0.85rem 0.95rem",
  borderRadius: "12px",
  border: `1px dashed ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
  color: colors.textMuted,
  fontSize: "0.92rem",
  lineHeight: 1.5,
};

const buttonIconTextRowStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
};

export default EditorSection;