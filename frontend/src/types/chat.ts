export type ChatConversationType = "TEAM" | "DIRECT";

export type ChatConversation = {
  id: number;
  type: ChatConversationType;
  teamId: number | null;
  teamName: string | null;
  title: string;
  createdAt: string;
};

export type ChatMessage = {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
};

export type CreateChatMessageRequest = {
  content: string;
};