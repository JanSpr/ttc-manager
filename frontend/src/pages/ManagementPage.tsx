import { Link } from "react-router-dom";
import PageIntro from "../components/layout/PageIntro";
import Card from "../components/ui/Card";
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
        description="Hier pflegst du die Stammdaten für Mitglieder und Mannschaften. Dieser Bereich ist nur für berechtigte Benutzer sichtbar."
        eyebrow="Intern"
        accent
      />

      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "1 1 320px" }}>
            <h2 style={{ ...cardTitleStyle, marginBottom: "0.5rem" }}>
              Zweck dieses Bereichs
            </h2>

            <p
              style={{
                margin: 0,
                color: colors.textMuted,
                lineHeight: 1.7,
              }}
            >
              Diese Verwaltungsoberfläche soll dir das Anlegen und Pflegen von
              Test- und Stammdaten erleichtern, damit du dafür nicht ständig
              direkt in der Datenbank arbeiten musst.
            </p>
          </div>

          <div
            style={{
              ...badgeStyle,
              alignSelf: "flex-start",
            }}
          >
            ADMIN / BOARD
          </div>
        </div>
      </Card>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          marginTop: "1.5rem",
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
                gap: "0.9rem",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                }}
              >
                👤
              </div>

              <div>
                <h2 style={{ ...cardTitleStyle, marginBottom: "0.45rem" }}>
                  Mitglieder verwalten
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: colors.textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  Mitglieder anlegen, bearbeiten und später komfortabel
                  Mannschaften zuordnen.
                </p>
              </div>
            </div>
          </ClickableCard>
        </Link>

        <ClickableCard style={{ height: "100%", opacity: 0.8 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.9rem",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
              }}
            >
              🏓
            </div>

            <div>
              <h2 style={{ ...cardTitleStyle, marginBottom: "0.45rem" }}>
                Mannschaften verwalten
              </h2>

              <p
                style={{
                  margin: 0,
                  color: colors.textMuted,
                  lineHeight: 1.6,
                }}
              >
                Dieser Bereich folgt als Nächstes nach der Mitgliederverwaltung.
              </p>
            </div>
          </div>
        </ClickableCard>
      </div>

      <Card>
        <h2 style={cardTitleStyle}>Als Nächstes</h2>
        <p
          style={{
            margin: 0,
            color: colors.textMuted,
            lineHeight: 1.6,
          }}
        >
          Zuerst bauen wir die Mitgliederverwaltung stabil aus. Danach folgt die
          gleiche Struktur für Mannschaften.
        </p>
      </Card>
    </div>
  );
}

export default ManagementPage;