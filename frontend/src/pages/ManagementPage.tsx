import { Link } from "react-router-dom";
import PageIntro from "../components/layout/PageIntro";
import ClickableCard from "../components/ui/ClickableCard";
import {
  badgeStyle,
  cardTitleStyle,
  colors,
  pageContainerStyle,
} from "../styles/ui";

function ManagementPage() {
  return (
    <div style={pageContainerStyle}>
      <PageIntro
        title="Verwaltung"
        description="Pflege hier die zentralen Stammdaten für Mitglieder und Mannschaften."
        eyebrow="Intern"
        accent
        style={{ padding: "1.1rem 1.3rem" }}
      />

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          marginTop: "1rem",
        }}
      >
        <Link
          to="/management/members"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ClickableCard style={{ height: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div style={badgeStyle}>
                Mitglieder
              </div>

              <h2 style={{ ...cardTitleStyle, margin: 0 }}>
                Mitgliederverwaltung
              </h2>

              <p
                style={{
                  margin: 0,
                  color: colors.textMuted,
                  lineHeight: 1.6,
                }}
              >
                Erfasse Vereinsmitglieder, pflege persönliche Grunddaten und
                verknüpfe sie bei Bedarf mit einem Benutzerkonto.
              </p>
            </div>
          </ClickableCard>
        </Link>

        <Link
          to="/management/teams"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ClickableCard style={{ height: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              <div style={badgeStyle}>
                Mannschaften
              </div>

              <h2 style={{ ...cardTitleStyle, margin: 0 }}>
                Mannschaftsverwaltung
              </h2>

              <p
                style={{
                  margin: 0,
                  color: colors.textMuted,
                  lineHeight: 1.6,
                }}
              >
                Lege Mannschaften an, ordne sie nach Erwachsenen- oder
                Jugendbereich ein und pflege ihre grundlegenden Informationen.
              </p>
            </div>
          </ClickableCard>
        </Link>
      </div>
    </div>
  );
}

export default ManagementPage;