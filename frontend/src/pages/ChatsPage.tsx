import { useEffect, useMemo, useState } from "react";
import { fetchChatConversations } from "../api/chatApi";
import type { ChatConversation } from "../types/chat";
import PageIntro from "../components/layout/PageIntro";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import StatusMessage from "../components/ui/StatusMessage";
import TeamAvatar from "../components/ui/TeamAvatar";
import { cardTitleStyle, colors } from "../styles/ui";

function sortConversationsByTitle(
  a: ChatConversation,
  b: ChatConversation
): number {
  return a.title.localeCompare(b.title, "de", {
    numeric: true,
    sensitivity: "base",
  });
}

function formatConversationType(type: ChatConversation["type"]): string {
  switch (type) {
    case "TEAM":
      return "Mannschaft";
    case "DIRECT":
      return "Direktchat";
    default:
      return type;
  }
}

function ChatListItem({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: ChatConversation;
  isSelected: boolean;
  onSelect: (conversation: ChatConversation) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: "100%",
        border: `1px solid ${
          isSelected ? "rgba(37, 99, 235, 0.32)" : colors.border
        }`,
        borderRadius: "16px",
        padding: "1rem 1.1rem",
        backgroundColor: isSelected
          ? colors.primarySoft
          : isHovered
            ? "#fcfcfd"
            : colors.surface,
        boxShadow: isSelected
          ? "0 10px 24px rgba(37, 99, 235, 0.10)"
          : isHovered
            ? "0 12px 28px rgba(15, 23, 42, 0.10)"
            : "0 2px 8px rgba(15, 23, 42, 0.04)",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: "0.9rem",
        transition:
          "background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <TeamAvatar teamName={conversation.title} />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "grid",
          gap: "0.3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "1.05rem",
              color: colors.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {conversation.title}
          </h3>

          <Badge
            size="sm"
            style={{
              opacity: 0.85,
              fontWeight: 500,
            }}
          >
            {formatConversationType(conversation.type)}
          </Badge>
        </div>

        <p
          style={{
            margin: 0,
            color: colors.textMuted,
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          Noch keine Vorschau verfügbar.
        </p>
      </div>
    </button>
  );
}

export default function ChatsPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sortedConversations = useMemo(
    () => conversations.slice().sort(sortConversationsByTitle),
    [conversations]
  );

  const selectedConversation =
    sortedConversations.find(
      (conversation) => conversation.id === selectedConversationId
    ) ?? sortedConversations[0];

  useEffect(() => {
    let isMounted = true;

    fetchChatConversations()
      .then((loadedConversations) => {
        if (!isMounted) return;

        setConversations(loadedConversations);
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;

        console.error("Fehler beim Laden der Chats:", err);
        setError("Chats konnten nicht geladen werden.");
      })
      .finally(() => {
        if (!isMounted) return;

        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <PageIntro
        eyebrow="Chats"
        title="Chats"
        description="Kommunikation mit Mannschaften und Mitgliedern. Direktchats können später ergänzt werden."
        accent
      />

      {error ? <StatusMessage variant="error">{error}</StatusMessage> : null}

      {isLoading ? (
        <StatusMessage variant="muted">Chats werden geladen...</StatusMessage>
      ) : null}

      {!isLoading && !error && conversations.length === 0 ? (
        <StatusMessage variant="muted">
          Aktuell sind keine Chats verfügbar.
        </StatusMessage>
      ) : null}

      {!isLoading && !error && conversations.length > 0 ? (
        <Card>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(280px, 360px) 1fr",
              gap: "1.25rem",
              alignItems: "stretch",
            }}
          >
            <section>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h2 style={cardTitleStyle}>Deine Chats</h2>

                  <p
                    style={{
                      margin: 0,
                      color: colors.textMuted,
                      lineHeight: 1.5,
                    }}
                  >
                    Mannschaftschats, auf die du Zugriff hast.
                  </p>
                </div>

                <Badge>{sortedConversations.length}</Badge>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "0.85rem",
                }}
              >
                {sortedConversations.map((conversation) => (
                  <ChatListItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={conversation.id === selectedConversation?.id}
                    onSelect={(nextConversation) =>
                      setSelectedConversationId(nextConversation.id)
                    }
                  />
                ))}
              </div>
            </section>

            <section
              style={{
                border: `1px solid ${colors.border}`,
                borderRadius: "18px",
                backgroundColor: colors.surfaceSoft,
                padding: "1.25rem",
                minHeight: "320px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  maxWidth: "420px",
                  display: "grid",
                  gap: "0.65rem",
                }}
              >
                <Badge style={{ justifySelf: "center" }}>
                  {selectedConversation
                    ? formatConversationType(selectedConversation.type)
                    : "Chat"}
                </Badge>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "1.35rem",
                    color: colors.text,
                  }}
                >
                  {selectedConversation?.title ?? "Kein Chat ausgewählt"}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: colors.textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  Im nächsten Schritt zeigen wir hier die Nachrichten an und
                  ergänzen das Eingabefeld zum Schreiben.
                </p>
              </div>
            </section>
          </div>
        </Card>
      ) : null}
    </>
  );
}