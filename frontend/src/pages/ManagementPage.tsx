import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import PageIntro from "../components/layout/PageIntro";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { colors } from "../styles/ui";

type AdminArea = {
  title: string;
  description: string;
  to: string;
  badge: string;
};

const adminAreas: AdminArea[] = [
  {
    title: "Nutzerverwaltung",
    description:
      "Mitglieder, vorbereitete Accounts, Aktivierungscodes und registrierte Benutzer verwalten.",
    to: "/management/members",
    badge: "Mitglieder & Accounts",
  },
  {
    title: "Mannschaften",
    description:
      "Mannschaften anlegen, Stammdaten pflegen, Mitglieder zuordnen und Aufstellungen verwalten.",
    to: "/management/teams",
    badge: "Teams",
  },
];

export default function ManagementPage() {
  return (
    <div>
      <PageIntro
        eyebrow="Administration"
        title="Verwaltung"
        description="Zentrale Übersicht für administrative Aufgaben im TTC Manager."
        accent
      />

      <div style={gridStyle}>
        {adminAreas.map((area) => (
          <Link key={area.to} to={area.to} style={linkStyle}>
            <Card style={cardStyle}>
              <div style={cardHeaderStyle}>
                <Badge>{area.badge}</Badge>
                <span style={arrowStyle}>→</span>
              </div>

              <h2 style={titleStyle}>{area.title}</h2>
              <p style={descriptionStyle}>{area.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "16px",
  marginTop: "18px",
};

const linkStyle: CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

const cardStyle: CSSProperties = {
  height: "100%",
  cursor: "pointer",
  transition:
    "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
};

const cardHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "18px",
};

const arrowStyle: CSSProperties = {
  color: colors.textMuted,
  fontSize: "1.4rem",
  fontWeight: 700,
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: colors.text,
  fontSize: "1.25rem",
};

const descriptionStyle: CSSProperties = {
  margin: "10px 0 0",
  color: colors.textMuted,
  lineHeight: 1.6,
};