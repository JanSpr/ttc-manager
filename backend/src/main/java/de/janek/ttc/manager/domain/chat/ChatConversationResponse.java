package de.janek.ttc.manager.domain.chat;

import java.time.LocalDateTime;

/**
 * Response-DTO für Chat-Unterhaltungen.
 */
public class ChatConversationResponse {

	private Long id;
	private ChatConversationType type;
	private Long teamId;
	private String teamName;
	private String title;
	private LocalDateTime createdAt;

	public ChatConversationResponse(Long id, ChatConversationType type, Long teamId, String teamName, String title,
			LocalDateTime createdAt) {
		this.id = id;
		this.type = type;
		this.teamId = teamId;
		this.teamName = teamName;
		this.title = title;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public ChatConversationType getType() {
		return type;
	}

	public Long getTeamId() {
		return teamId;
	}

	public String getTeamName() {
		return teamName;
	}

	public String getTitle() {
		return title;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}
}