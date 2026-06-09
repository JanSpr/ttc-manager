package de.janek.ttc.manager.domain.chat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository für Chat-Unterhaltungen.
 */
public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {

	Optional<ChatConversation> findByTypeAndTeamId(ChatConversationType type, Long teamId);

	boolean existsByTypeAndTeamId(ChatConversationType type, Long teamId);
}