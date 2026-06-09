package de.janek.ttc.manager.domain.chat;

import java.time.LocalDateTime;

/**
 * Response-DTO für Chat-Nachrichten.
 */
public class ChatMessageResponse {

	private Long id;
	private Long conversationId;
	private Long senderId;
	private String senderName;
	private String content;
	private LocalDateTime createdAt;

	public ChatMessageResponse(Long id, Long conversationId, Long senderId, String senderName, String content,
			LocalDateTime createdAt) {
		this.id = id;
		this.conversationId = conversationId;
		this.senderId = senderId;
		this.senderName = senderName;
		this.content = content;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public Long getConversationId() {
		return conversationId;
	}

	public Long getSenderId() {
		return senderId;
	}

	public String getSenderName() {
		return senderName;
	}

	public String getContent() {
		return content;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}