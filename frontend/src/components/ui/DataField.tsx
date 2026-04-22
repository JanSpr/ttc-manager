import { colors } from "../../styles/ui";

export type DataFieldProps = {
  label: string;
  value: string;
  helpText?: string;
};

function DataField({ label, value, helpText }: DataFieldProps) {
  return (
    <div
      style={{
        padding: "1rem 1.1rem",
        border: `1px solid ${colors.border}`,
        borderRadius: "14px",
        backgroundColor: colors.surface,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: "0.9rem",
          color: colors.textMuted,
          marginBottom: "0.35rem",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "1rem",
          color: colors.text,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>

      {helpText ? (
        <div
          style={{
            marginTop: "0.4rem",
            fontSize: "0.8rem",
            color: colors.textMuted,
          }}
        >
          {helpText}
        </div>
      ) : null}
    </div>
  );
}

export default DataField;