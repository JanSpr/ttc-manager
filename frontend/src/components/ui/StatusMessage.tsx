import { colors } from "../../styles/ui";

type StatusMessageVariant = "info" | "error" | "muted";

type StatusMessageProps = {
  children: string;
  variant?: StatusMessageVariant;
  marginTop?: string;
};

export default function StatusMessage({
  children,
  variant = "info",
  marginTop = "1rem",
}: StatusMessageProps) {
  const resolvedColor =
    variant === "error"
      ? colors.danger
      : variant === "muted"
        ? colors.textMuted
        : colors.text;

  return <p style={{ marginTop, color: resolvedColor }}>{children}</p>;
}