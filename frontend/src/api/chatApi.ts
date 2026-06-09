import { apiGet, apiPost } from "./api";
import type {
  ChatConversation,
  ChatMessage,
  CreateChatMessageRequest,
} from "../types/chat";

export async function fetchChatConversations(): Promise<ChatConversation[]> {
  return apiGet<ChatConversation[]>("/api/chats");
}

export async function fetchChatMessages(
  conversationId: number
): Promise<ChatMessage[]> {
  return apiGet<ChatMessage[]>(`/api/chats/${conversationId}/messages`);
}

export async function createChatMessage(
  conversationId: number,
  request: CreateChatMessageRequest
): Promise<ChatMessage> {
  return apiPost<ChatMessage, CreateChatMessageRequest>(
    `/api/chats/${conversationId}/messages`,
    request
  );
}