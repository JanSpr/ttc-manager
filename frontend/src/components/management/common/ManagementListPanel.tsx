import type { ReactNode } from "react";
import Card from "../../ui/Card";
import StatusMessage from "../../ui/StatusMessage";
import { badgeStyle, cardTitleStyle, colors } from "../../../styles/ui";
import { managementCreateButtonStyle } from "./managementUiStyles";

type ManagementListPanelProps = {
  title: string;
  description: string;
  countLabel: string;
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  createLabel: string;
  onCreate: () => void;
  createIcon?: ReactNode;
  isLoading: boolean;
  loadingText: string;
  loadError: string;
  emptyText: string;
  isEditorOpen: boolean;
  children: ReactNode;
};

function ManagementListPanel({
  title,
  description,
  countLabel,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  onClearSearch,
  createLabel,
  onCreate,
  createIcon,
  isLoading,
  loadingText,
  loadError,
  emptyText,
  isEditorOpen,
  children,
}: ManagementListPanelProps) {
  return (
    <Card style={{ marginTop: 0 }}>
      <div style={headerRowStyle}>
        <div>
          <h2 style={{ ...cardTitleStyle, marginBottom: "0.2rem" }}>{title}</h2>
          <p style={descriptionStyle}>{description}</p>
        </div>

        {!isEditorOpen ? <div style={badgeStyle}>{countLabel}</div> : null}
      </div>

      <div style={searchWrapperStyle}>
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          style={searchInputStyle}
        />

        {searchValue ? (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Suche zurücksetzen"
            title="Suche zurücksetzen"
            style={clearButtonStyle}
          >
            ×
          </button>
        ) : null}
      </div>

      <div style={createActionRowStyle}>
        <button type="button" onClick={onCreate} style={managementCreateButtonStyle}>
          {createIcon}
          <span>{createLabel}</span>
        </button>
      </div>

      {isLoading ? (
        <StatusMessage marginTop="0">{loadingText}</StatusMessage>
      ) : loadError ? (
        <StatusMessage variant="error" marginTop="0">
          {loadError}
        </StatusMessage>
      ) : (
        <div>{children}</div>
      )}

      {!isLoading && !loadError ? (
        <div style={{ display: "none" }} aria-hidden="true">
          {emptyText}
        </div>
      ) : null}
    </Card>
  );
}

export function ManagementListPanelContent({
  isEmpty,
  emptyText,
  children,
}: {
  isEmpty: boolean;
  emptyText: string;
  children: ReactNode;
}) {
  if (isEmpty) {
    return (
      <StatusMessage variant="muted" marginTop="0">
        {emptyText}
      </StatusMessage>
    );
  }

  return (
    <div style={listCardStyle}>
      <div style={listScrollAreaStyle}>{children}</div>
    </div>
  );
}

const headerRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center" as const,
  gap: "0.75rem",
  flexWrap: "wrap" as const,
  marginBottom: "0.9rem",
};

const descriptionStyle = {
  margin: 0,
  color: colors.textMuted,
  fontSize: "0.92rem",
};

const searchWrapperStyle = {
  marginBottom: "0.8rem",
  position: "relative" as const,
};

const searchInputStyle = {
  width: "100%",
  padding: "11px 36px 11px 13px",
  borderRadius: "12px",
  border: `1px solid ${colors.borderStrong}`,
  backgroundColor: "#ffffff",
  color: colors.text,
  boxSizing: "border-box" as const,
};

const clearButtonStyle = {
  position: "absolute" as const,
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  width: "24px",
  height: "24px",
  borderRadius: "999px",
  border: "none",
  background: "transparent",
  color: colors.textMuted,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  lineHeight: 1,
};

const createActionRowStyle = {
  display: "flex",
  justifyContent: "center",
  gap: "0.55rem",
  flexWrap: "wrap" as const,
  marginBottom: "0.9rem",
};

const listCardStyle = {
  border: `1px solid ${colors.border}`,
  borderRadius: "14px",
  overflow: "hidden",
  backgroundColor: colors.surfaceSoft,
};

const listScrollAreaStyle = {
  maxHeight: "540px",
  overflowY: "auto" as const,
};

export default ManagementListPanel;