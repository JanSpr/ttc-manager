package de.janek.ttc.manager.domain.chat;

import de.janek.ttc.manager.domain.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Einzelne Nachricht innerhalb einer Chat-Unterhaltung.
 */
@Entity
@Table(name = "chat_message")
public class ChatMessage {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "conversation_id", nullable = false)
	private ChatConversation conversation;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "sender_id", nullable = false)
	private User sender;

	@Column(name = "content", nullable = false, length = 2000)
	private String content;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	public ChatMessage() {
	}

	public ChatMessage(ChatConversation conversation, User sender, String content) {
		this.conversation = conversation;
		this.sender = sender;
		this.content = content;
		this.createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public ChatConversation getConversation() {
		return conversation;
	}

	public User getSender() {
		return sender;
	}

	public String getContent() {
		return content;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setConversation(ChatConversation conversation) {
		this.conversation = conversation;
	}

	public void setSender(User sender) {
		this.sender = sender;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof ChatMessage that))
			return false;
		return id != null && Objects.equals(id, that.id);
	}

	@Override
	public int hashCode() {
		return getClass().hashCode();
	}
}