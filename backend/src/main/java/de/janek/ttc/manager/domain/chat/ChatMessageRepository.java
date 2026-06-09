package de.janek.ttc.manager.domain.chat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository für Chat-Nachrichten.
 */
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

	List<ChatMessage> findAllByConversationIdOrderByCreatedAtAsc(Long conversationId);
}