import { useEffect, useMemo, useState } from "react";
import {
  createChatMessage,
  fetchChatConversations,
  fetchChatMessages,
} from "../api/chatApi";
import type { ChatConversation, ChatMessage } from "../types/chat";
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

function formatMessageTime(value: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
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

      <div style={{ flex: 1, minWidth: 0, display: "grid", gap: "0.3rem" }}>
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

          <Badge size="sm" style={{ opacity: 0.85, fontWeight: 500 }}>
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
          Nachrichten anzeigen
        </p>
      </div>
    </button>
  );
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  return (
    <article
      style={{
        padding: "0.95rem 1rem",
        borderRadius: "16px",
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        display: "grid",
        gap: "0.45rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "1rem",
        }}
      >
        <strong style={{ color: colors.text, fontSize: "0.95rem" }}>
          {message.senderName}
        </strong>

        <span
          style={{
            color: colors.textMuted,
            fontSize: "0.78rem",
            whiteSpace: "nowrap",
          }}
        >
          {formatMessageTime(message.createdAt)}
        </span>
      </div>

      <p
        style={{
          margin: 0,
          color: colors.text,
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
      >
        {message.content}
      </p>
    </article>
  );
}

export default function ChatsPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(
    null
  );
  const [messageError, setMessageError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const sortedConversations = useMemo(
    () => conversations.slice().sort(sortConversationsByTitle),
    [conversations]
  );

  const selectedConversation =
    sortedConversations.find(
      (conversation) => conversation.id === selectedConversationId
    ) ?? null;

  const trimmedMessageText = messageText.trim();
  const canSendMessage =
    Boolean(selectedConversationId) &&
    trimmedMessageText.length > 0 &&
    !isSendingMessage;

  function handleSelectConversation(conversation: ChatConversation) {
    setSelectedConversationId(conversation.id);
    setMessages([]);
    setMessageText("");
    setIsLoadingMessages(true);
    setMessageError(null);
    setSendError(null);
  }

  async function handleSubmitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedConversationId || trimmedMessageText.length === 0) {
      return;
    }

    setIsSendingMessage(true);
    setSendError(null);

    try {
      await createChatMessage(selectedConversationId, {
        content: trimmedMessageText,
      });

      const loadedMessages = await fetchChatMessages(selectedConversationId);
      setMessages(loadedMessages);
      setMessageText("");
      setMessageError(null);
    } catch (error) {
      console.error("Fehler beim Senden der Nachricht:", error);
      setSendError("Nachricht konnte nicht gesendet werden.");
    } finally {
      setIsSendingMessage(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    fetchChatConversations()
      .then((loadedConversations) => {
        if (!isMounted) return;

        const sortedLoadedConversations = loadedConversations
          .slice()
          .sort(sortConversationsByTitle);

        setConversations(loadedConversations);
        setConversationError(null);

        if (sortedLoadedConversations.length > 0) {
          setSelectedConversationId(sortedLoadedConversations[0].id);
          setIsLoadingMessages(true);
        }
      })
      .catch((err) => {
        if (!isMounted) return;

        console.error("Fehler beim Laden der Chats:", err);
        setConversationError("Chats konnten nicht geladen werden.");
      })
      .finally(() => {
        if (!isMounted) return;

        setIsLoadingConversations(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedConversationId) {
      return;
    }

    let isMounted = true;

    fetchChatMessages(selectedConversationId)
      .then((loadedMessages) => {
        if (!isMounted) return;

        setMessages(loadedMessages);
        setMessageError(null);
      })
      .catch((err) => {
        if (!isMounted) return;

        console.error("Fehler beim Laden der Nachrichten:", err);
        setMessageError("Nachrichten konnten nicht geladen werden.");
      })
      .finally(() => {
        if (!isMounted) return;

        setIsLoadingMessages(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedConversationId]);

  return (
    <>
      <PageIntro
        eyebrow="Chats"
        title="Chats"
        description="Kommunikation mit Mannschaften und Mitgliedern. Direktchats können später ergänzt werden."
        accent
      />

      {conversationError ? (
        <StatusMessage variant="error">{conversationError}</StatusMessage>
      ) : null}

      {isLoadingConversations ? (
        <StatusMessage variant="muted">Chats werden geladen...</StatusMessage>
      ) : null}

      {!isLoadingConversations &&
      !conversationError &&
      conversations.length === 0 ? (
        <StatusMessage variant="muted">
          Aktuell sind keine Chats verfügbar.
        </StatusMessage>
      ) : null}

      {!isLoadingConversations &&
      !conversationError &&
      conversations.length > 0 ? (
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

              <div style={{ display: "grid", gap: "0.85rem" }}>
                {sortedConversations.map((conversation) => (
                  <ChatListItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={conversation.id === selectedConversation?.id}
                    onSelect={handleSelectConversation}
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
                minHeight: "420px",
                display: "grid",
                gridTemplateRows: "auto 1fr auto",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  paddingBottom: "1rem",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.85rem",
                    alignItems: "center",
                    minWidth: 0,
                  }}
                >
                  {selectedConversation ? (
                    <TeamAvatar teamName={selectedConversation.title} />
                  ) : null}

                  <div style={{ minWidth: 0 }}>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.25rem",
                        color: colors.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {selectedConversation?.title ?? "Kein Chat ausgewählt"}
                    </h2>

                    <p
                      style={{
                        margin: "0.25rem 0 0",
                        color: colors.textMuted,
                        fontSize: "0.9rem",
                      }}
                    >
                      Nachrichtenverlauf
                    </p>
                  </div>
                </div>

                {selectedConversation ? (
                  <Badge>
                    {formatConversationType(selectedConversation.type)}
                  </Badge>
                ) : null}
              </div>

              <div
                style={{
                  minHeight: 0,
                  overflowY: "auto",
                  display: "grid",
                  alignContent: "start",
                  gap: "0.85rem",
                  paddingRight: "0.25rem",
                }}
              >
                {messageError ? (
                  <StatusMessage variant="error">{messageError}</StatusMessage>
                ) : null}

                {isLoadingMessages ? (
                  <StatusMessage variant="muted">
                    Nachrichten werden geladen...
                  </StatusMessage>
                ) : null}

                {!isLoadingMessages && !messageError && messages.length === 0 ? (
                  <StatusMessage variant="muted">
                    In diesem Chat gibt es noch keine Nachrichten.
                  </StatusMessage>
                ) : null}

                {!isLoadingMessages && !messageError
                  ? messages.map((message) => (
                      <ChatMessageItem key={message.id} message={message} />
                    ))
                  : null}
              </div>

              <form
                onSubmit={handleSubmitMessage}
                style={{
                  display: "grid",
                  gap: "0.65rem",
                  paddingTop: "1rem",
                  borderTop: `1px solid ${colors.border}`,
                }}
              >
                {sendError ? (
                  <StatusMessage variant="error">{sendError}</StatusMessage>
                ) : null}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "0.75rem",
                    alignItems: "end",
                  }}
                >
                  <label
                    style={{
                      display: "grid",
                      gap: "0.4rem",
                    }}
                  >
                    <span
                      style={{
                        color: colors.textMuted,
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      Nachricht
                    </span>

                    <textarea
                      value={messageText}
                      onChange={(event) => {
                        setMessageText(event.target.value);
                        setSendError(null);
                      }}
                      placeholder="Nachricht schreiben..."
                      maxLength={2000}
                      rows={2}
                      disabled={!selectedConversation || isSendingMessage}
                      style={{
                        width: "100%",
                        resize: "vertical",
                        minHeight: "46px",
                        maxHeight: "160px",
                        border: `1px solid ${colors.border}`,
                        borderRadius: "14px",
                        padding: "0.75rem 0.85rem",
                        color: colors.text,
                        backgroundColor: colors.surface,
                        font: "inherit",
                        lineHeight: 1.45,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={!canSendMessage}
                    style={{
                      border: "none",
                      borderRadius: "14px",
                      padding: "0.8rem 1.1rem",
                      minHeight: "46px",
                      backgroundColor: canSendMessage
                        ? colors.primary
                        : colors.border,
                      color: canSendMessage ? "#ffffff" : colors.textMuted,
                      fontWeight: 700,
                      cursor: canSendMessage ? "pointer" : "not-allowed",
                      boxShadow: canSendMessage
                        ? "0 10px 24px rgba(37, 99, 235, 0.22)"
                        : "none",
                      transition:
                        "background-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
                    }}
                  >
                    {isSendingMessage ? "Sendet..." : "Senden"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </Card>
      ) : null}
    </>
  );
}