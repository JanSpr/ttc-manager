import type { CSSProperties, ReactNode } from "react";
import { badgeStyle, colors } from "../../../styles/ui";

type EditorSectionProps = {
  sectionId?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  actions?: ReactNode;
  headerContent?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  collapsedHint?: string;
  children: ReactNode;
};

function EditorSection({
  sectionId,
  title,
  description,
  actionLabel,
  actionIcon,
  actions,
  headerContent,
  isOpen,
  onToggle,
  collapsedHint,
  children,
}: EditorSectionProps) {
  const contentId = sectionId ? `${sectionId}-content` : undefined;

  const resolvedActions =
    actions ??
    (actionLabel ? (
      <button
        type="button"
        onClick={onToggle}
        style={sectionActionButtonStyle}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span style={buttonIconTextRowStyle}>
          {actionIcon}
          <span>{actionLabel}</span>
        </span>
      </button>
    ) : null);

  return (
    <section style={sectionCardStyle}>
      <div style={sectionHeaderRowStyle}>
        <div style={sectionHeaderTextStyle}>
          <div style={sectionBadgeRowStyle}>
            <span style={badgeStyle}>{title}</span>
          </div>

          {description ? (
            <p style={sectionDescriptionStyle}>{description}</p>
          ) : null}

          {headerContent ? (
            <div style={sectionHeaderContentStyle}>{headerContent}</div>
          ) : null}
        </div>

        {resolvedActions ? (
          <div style={sectionActionsWrapperStyle}>{resolvedActions}</div>
        ) : null}
      </div>

      {isOpen ? (
        <div id={contentId} style={sectionContentStyle}>
          {children}
        </div>
      ) : collapsedHint ? (
        <div id={contentId} style={sectionCollapsedHintStyle}>
          {collapsedHint}
        </div>
      ) : null}
    </section>
  );
}

const sectionCardStyle: CSSProperties = {
  display: "grid",
  gap: "0.9rem",
  padding: "1rem",
  borderRadius: "16px",
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
};

const sectionHeaderRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  flexWrap: "wrap",
};

const sectionHeaderTextStyle: CSSProperties = {
  minWidth: 0,
  flex: 1,
  display: "grid",
  gap: "0.5rem",
};

const sectionBadgeRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const sectionDescriptionStyle: CSSProperties = {
  margin: 0,
  color: colors.textMuted,
  fontSize: "0.95rem",
  lineHeight: 1.5,
};

const sectionHeaderContentStyle: CSSProperties = {
  display: "grid",
  gap: "0.5rem",
};

const sectionActionsWrapperStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  flexShrink: 0,
};

const sectionActionButtonStyle: CSSProperties = {
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

const sectionContentStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
};

const sectionCollapsedHintStyle: CSSProperties = {
  padding: "0.85rem 0.95rem",
  borderRadius: "12px",
  border: `1px dashed ${colors.border}`,
  backgroundColor: colors.surfaceSoft,
  color: colors.textMuted,
  fontSize: "0.92rem",
  lineHeight: 1.5,
};

const buttonIconTextRowStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
};

export default EditorSection;