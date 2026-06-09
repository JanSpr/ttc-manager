package de.janek.ttc.manager.domain.chat;

import de.janek.ttc.manager.domain.team.Team;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Repräsentiert eine Chat-Unterhaltung.
 *
 * Für den ersten Schritt nutzen wir nur TEAM-Conversations. DIRECT ist bewusst
 * vorbereitet, wird aber noch nicht verwendet.
 */
@Entity
@Table(name = "chat_conversation", uniqueConstraints = {
		@UniqueConstraint(name = "uk_chat_conversation_team", columnNames = "team_id") })
public class ChatConversation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(name = "type", nullable = false, length = 50)
	private ChatConversationType type;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "team_id", unique = true)
	private Team team;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	@OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<ChatMessage> messages = new HashSet<>();

	public ChatConversation() {
	}

	public ChatConversation(ChatConversationType type, Team team) {
		this.type = type;
		this.team = team;
		this.createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public ChatConversationType getType() {
		return type;
	}

	public Team getTeam() {
		return team;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public Set<ChatMessage> getMessages() {
		return messages;
	}

	public void setType(ChatConversationType type) {
		this.type = type;
	}

	public void setTeam(Team team) {
		this.team = team;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public void setMessages(Set<ChatMessage> messages) {
		this.messages = messages;
	}

	public void addMessage(ChatMessage message) {
		messages.add(message);
		message.setConversation(this);
	}

	public void removeMessage(ChatMessage message) {
		messages.remove(message);
		message.setConversation(null);
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof ChatConversation that))
			return false;
		return id != null && Objects.equals(id, that.id);
	}

	@Override
	public int hashCode() {
		return getClass().hashCode();
	}
}