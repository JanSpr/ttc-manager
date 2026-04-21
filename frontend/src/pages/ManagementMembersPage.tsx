import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageIntro from "../components/layout/PageIntro";
import Card from "../components/ui/Card";
import ClickableCard from "../components/ui/ClickableCard";
import StatusMessage from "../components/ui/StatusMessage";
import MemberForm from "../components/management/MemberForm";
import { useToast } from "../context/useToast";
import {
  createMember,
  deleteMember,
  fetchMembers,
  updateMember,
} from "../api/memberApi";
import type { Member, MemberUpsertRequest } from "../types/member";
import {
  badgeStyle,
  cardTitleStyle,
  colors,
  pageContainerStyle,
  secondaryButtonStyle,
} from "../styles/ui";

function ManagementMembersPage() {
  const { showToast } = useToast();

  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadInitialMembers() {
      try {
        const loadedMembers = await fetchMembers();

        if (!isMounted) {
          return;
        }

        setMembers(loadedMembers);
      } catch (error) {
        console.error("Mitglieder konnten nicht geladen werden.", error);

        if (!isMounted) {
          return;
        }

        setLoadError("Die Mitglieder konnten nicht geladen werden.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(request: MemberUpsertRequest) {
    setIsSubmitting(true);

    try {
      if (selectedMember) {
        const updatedMember = await updateMember(selectedMember.id, request);

        setMembers((current) =>
          current.map((member) =>
            member.id === updatedMember.id ? updatedMember : member
          )
        );

        setSelectedMember(updatedMember);
        showToast("Mitglied erfolgreich aktualisiert.", "success");
        return;
      }

      const createdMember = await createMember(request);

      setMembers((current) =>
        [...current, createdMember].sort((a, b) => a.id - b.id)
      );

      showToast("Mitglied erfolgreich angelegt.", "success");
    } catch (error) {
      console.error("Mitglied konnte nicht gespeichert werden.", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Mitglied konnte nicht gespeichert werden.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(member: Member) {
    const confirmed = window.confirm(
      `Möchtest du ${member.fullName} wirklich löschen?`
    );

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);

    try {
      await deleteMember(member.id);

      setMembers((current) => current.filter((entry) => entry.id !== member.id));

      if (selectedMember?.id === member.id) {
        setSelectedMember(null);
      }

      showToast("Mitglied erfolgreich gelöscht.", "success");
    } catch (error) {
      console.error("Mitglied konnte nicht gelöscht werden.", error);
      showToast(
        error instanceof Error
          ? error.message
          : "Mitglied konnte nicht gelöscht werden.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const sortedMembers = useMemo(
    () =>
      [...members].sort((left, right) =>
        left.fullName.localeCompare(right.fullName, "de", {
          sensitivity: "base",
        })
      ),
    [members]
  );

  return (
    <div style={pageContainerStyle}>
      <PageIntro
        title="Mitgliederverwaltung"
        description="Hier kannst du Mitglieder anlegen, bearbeiten und für Tests schnell pflegen."
        eyebrow="Verwaltung"
        accent
      />

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ ...cardTitleStyle, marginBottom: "0.45rem" }}>
              Überblick
            </h2>
            <p
              style={{
                margin: 0,
                color: colors.textMuted,
                lineHeight: 1.6,
              }}
            >
              Die Liste zeigt alle vorhandenen Mitglieder. Rechts kannst du
              entweder ein neues Mitglied anlegen oder ein bestehendes Mitglied
              bearbeiten.
            </p>
          </div>

          <div style={badgeStyle}>{members.length} Mitglieder</div>
        </div>
      </Card>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
          alignItems: "start",
          marginTop: "1.5rem",
        }}
      >
        <Card style={{ marginTop: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ ...cardTitleStyle, marginBottom: 0 }}>
              Mitgliederliste
            </h2>

            {selectedMember ? (
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                style={secondaryButtonStyle}
              >
                Neues Mitglied
              </button>
            ) : null}
          </div>

          {isLoading ? (
            <StatusMessage>Lade Mitglieder...</StatusMessage>
          ) : loadError ? (
            <StatusMessage variant="error">{loadError}</StatusMessage>
          ) : sortedMembers.length === 0 ? (
            <StatusMessage variant="muted">
              Es sind noch keine Mitglieder vorhanden.
            </StatusMessage>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "0.85rem",
              }}
            >
              {sortedMembers.map((member) => {
                const isSelected = selectedMember?.id === member.id;

                return (
                  <ClickableCard
                    key={member.id}
                    style={{
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? "#f8fbff" : colors.surface,
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gap: "0.9rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "1rem",
                              fontWeight: 700,
                              color: colors.text,
                            }}
                          >
                            {member.fullName}
                          </div>

                          <div
                            style={{
                              marginTop: "0.25rem",
                              color: colors.textMuted,
                              fontSize: "0.92rem",
                            }}
                          >
                            ID: {member.id}
                            {member.userId != null
                              ? ` · User-ID: ${member.userId}`
                              : ""}
                          </div>
                        </div>

                        <div
                          style={{
                            ...badgeStyle,
                            backgroundColor: member.active
                              ? colors.primarySoft
                              : "#f3f4f6",
                            color: member.active
                              ? colors.primary
                              : colors.textMuted,
                            fontSize: "0.85rem",
                            padding: "0.3rem 0.65rem",
                          }}
                        >
                          {member.active ? "Aktiv" : "Inaktiv"}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "1rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            color: colors.textMuted,
                            fontSize: "0.92rem",
                          }}
                        >
                          Typ: {member.type === "ADULT" ? "Erwachsener" : "Jugend"}
                          {" · "}
                          Teams: {member.teamIds.length}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "0.6rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <Link
                            to={`/members/${member.id}`}
                            style={{
                              ...secondaryButtonStyle,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            Details
                          </Link>

                          <button
                            type="button"
                            onClick={() => setSelectedMember(member)}
                            style={secondaryButtonStyle}
                          >
                            Bearbeiten
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDelete(member)}
                            style={{
                              ...secondaryButtonStyle,
                              borderColor: "#fecaca",
                              color: colors.danger,
                              backgroundColor: colors.dangerSoft,
                            }}
                          >
                            Löschen
                          </button>
                        </div>
                      </div>
                    </div>
                  </ClickableCard>
                );
              })}
            </div>
          )}
        </Card>

        <Card style={{ marginTop: 0 }}>
          <MemberForm
            member={selectedMember}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancelEdit={() => setSelectedMember(null)}
          />
        </Card>
      </div>
    </div>
  );
}

export default ManagementMembersPage;