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
        description="Wähle hier aus, welchen Bereich du bearbeiten möchtest."
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
                gap: "0.9rem",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.15rem",
                }}
              >
                👤
              </div>

              <div>
                <div style={{ ...badgeStyle, marginBottom: "0.7rem" }}>
                  Bereits verfügbar
                </div>

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
                  Mitglieder kompakt auswählen, anlegen, bearbeiten und löschen.
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
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background:
                  "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.15rem",
              }}
            >
              🏓
            </div>

            <div>
              <div
                style={{
                  ...badgeStyle,
                  marginBottom: "0.7rem",
                  backgroundColor: "#f3f4f6",
                  color: colors.textMuted,
                }}
              >
                Als Nächstes
              </div>

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
                Dieser Bereich folgt im nächsten Schritt mit derselben Struktur.
              </p>
            </div>
          </div>
        </ClickableCard>
      </div>
    </div>
  );
}

export default ManagementPage;