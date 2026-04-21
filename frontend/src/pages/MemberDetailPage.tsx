import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchMemberById } from "../api/memberApi";
import { fetchTeams } from "../api/teamApi";
import type { Member } from "../types/member";
import type { Team } from "../types/team";
import PageIntro from "../components/layout/PageIntro";
import Card from "../components/ui/Card";
import DataField from "../components/ui/DataField";
import ClickableCard from "../components/ui/ClickableCard";
import StatusMessage from "../components/ui/StatusMessage";
import { cardTitleStyle, badgeStyle, colors } from "../styles/ui";

type LocationState = {
  fromTeamId?: number;
  fromTeamName?: string;
};

export default function MemberDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;

  const [member, setMember] = useState<Member | null>(null);
  const [memberTeams, setMemberTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMember() {
      if (!id) {
        setError("Keine Mitglieder-ID in der URL gefunden.");
        setLoading(false);
        return;
      }

      const memberId = Number(id);

      if (Number.isNaN(memberId)) {
        setError("Ungültige Mitglieder-ID.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [memberData, teamsData] = await Promise.all([
          fetchMemberById(memberId),
          fetchTeams(),
        ]);

        const resolvedTeams = teamsData.filter((team) =>
          memberData.teamIds.includes(team.id),
        );

        setMember(memberData);
        setMemberTeams(resolvedTeams);
      } catch (err) {
        console.error("Fehler beim Laden des Mitglieds:", err);
        setError("Mitglied konnte nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }

    void loadMember();
  }, [id]);

  const backTarget = state?.fromTeamId ? `/teams/${state.fromTeamId}` : "/teams";
  const backLabel = state?.fromTeamName
    ? `← Zurück zu ${state.fromTeamName}`
    : "← Zurück zur Teamliste";

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <Link to={backTarget} style={{ color: colors.primary }}>
          {backLabel}
        </Link>
      </div>

      {loading && <StatusMessage>Mitglied wird geladen...</StatusMessage>}
      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      {!loading && !error && member && (
        <>
          <PageIntro
            title={member.fullName}
            description="Detailansicht eines Vereinsmitglieds."
            eyebrow="Mitglied"
          />

          <Card>
            <h2 style={cardTitleStyle}>Grunddaten</h2>

            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              }}
            >
              <DataField label="Vorname" value={member.firstName || "-"} />
              <DataField label="Nachname" value={member.lastName || "-"} />
              <DataField label="Mitglieder-ID" value={String(member.id)} />
              <DataField
                label="Status"
                value={member.active ? "Aktiv" : "Inaktiv"}
              />
            </div>
          </Card>

          <Card>
            <h2 style={cardTitleStyle}>Verknüpfter Benutzer</h2>

            {member.userId ? (
              <div
                style={{
                  display: "grid",
                  gap: "1rem",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                }}
              >
                <DataField label="User-ID" value={String(member.userId)} />
              </div>
            ) : (
              <StatusMessage variant="muted" marginTop="0">
                Diesem Mitglied ist aktuell kein Benutzerkonto zugeordnet.
              </StatusMessage>
            )}
          </Card>

          <Card>
            <h2 style={cardTitleStyle}>Teams</h2>

            {memberTeams.length === 0 ? (
              <StatusMessage variant="muted" marginTop="0">
                Dieses Mitglied ist aktuell keinem Team zugeordnet.
              </StatusMessage>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "0.85rem",
                }}
              >
                {memberTeams.map((team) => (
                  <Link
                    key={team.id}
                    to={`/teams/${team.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ClickableCard>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "1rem",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              color: colors.text,
                              marginBottom: "0.3rem",
                            }}
                          >
                            {team.name}
                          </div>

                          <div
                            style={{
                              color: colors.textMuted,
                              fontSize: "0.95rem",
                            }}
                          >
                            {team.description || "Keine Beschreibung vorhanden."}
                          </div>
                        </div>

                        <div style={badgeStyle}>{team.memberCount} Mitglieder</div>
                      </div>
                    </ClickableCard>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}