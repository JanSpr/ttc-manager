package de.janek.ttc.manager.domain.chat;

import de.janek.ttc.manager.domain.team.Team;
import de.janek.ttc.manager.domain.team.TeamMembershipRepository;
import de.janek.ttc.manager.domain.team.TeamRepository;
import de.janek.ttc.manager.domain.user.GlobalRole;
import de.janek.ttc.manager.domain.user.User;
import de.janek.ttc.manager.domain.user.UserRepository;
import de.janek.ttc.manager.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class ChatService {

	private final ChatConversationRepository conversationRepository;
	private final ChatMessageRepository messageRepository;
	private final TeamRepository teamRepository;
	private final TeamMembershipRepository teamMembershipRepository;
	private final UserRepository userRepository;

	public ChatService(ChatConversationRepository conversationRepository, ChatMessageRepository messageRepository,
			TeamRepository teamRepository, TeamMembershipRepository teamMembershipRepository,
			UserRepository userRepository) {
		this.conversationRepository = conversationRepository;
		this.messageRepository = messageRepository;
		this.teamRepository = teamRepository;
		this.teamMembershipRepository = teamMembershipRepository;
		this.userRepository = userRepository;
	}

	public List<ChatConversationResponse> findVisibleConversations(String username) {
		User currentUser = getCurrentUser(username);
		boolean canSeeAll = hasAdministrationRole(currentUser);

		return teamRepository.findAll().stream()
				.filter(team -> canSeeAll || isUserMemberOfTeam(team.getId(), currentUser.getUsername()))
				.sorted(Comparator.comparing(Team::getName, String.CASE_INSENSITIVE_ORDER))
				.map(team -> getOrCreateTeamConversation(team, currentUser)).map(this::toConversationResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<ChatMessageResponse> findMessages(Long conversationId, String username) {
		User currentUser = getCurrentUser(username);
		ChatConversation conversation = getConversationEntityById(conversationId);

		validateAccess(conversation, currentUser);

		return messageRepository.findAllByConversationIdOrderByCreatedAtAsc(conversationId).stream()
				.map(this::toMessageResponse).toList();
	}

	public ChatMessageResponse createMessage(Long conversationId, String username, CreateChatMessageRequest request) {
		User currentUser = getCurrentUser(username);
		ChatConversation conversation = getConversationEntityById(conversationId);

		validateAccess(conversation, currentUser);

		ChatMessage message = new ChatMessage();
		message.setConversation(conversation);
		message.setSender(currentUser);
		message.setContent(normalizeRequiredText(request.getContent()));

		ChatMessage savedMessage = messageRepository.save(message);
		return toMessageResponse(savedMessage);
	}

	private ChatConversation getOrCreateTeamConversation(Team team, User currentUser) {
		return conversationRepository.findByTypeAndTeamId(ChatConversationType.TEAM, team.getId()).orElseGet(() -> {
			if (!hasAdministrationRole(currentUser) && !isUserMemberOfTeam(team.getId(), currentUser.getUsername())) {
				throw new AccessDeniedException("Du hast keinen Zugriff auf diesen Mannschaftschat.");
			}

			ChatConversation conversation = new ChatConversation();
			conversation.setType(ChatConversationType.TEAM);
			conversation.setTeam(team);
			return conversationRepository.save(conversation);
		});
	}

	private ChatConversation getConversationEntityById(Long conversationId) {
		return conversationRepository.findById(conversationId).orElseThrow(
				() -> new ResourceNotFoundException("Chat mit ID " + conversationId + " wurde nicht gefunden."));
	}

	private User getCurrentUser(String username) {
		return userRepository.findByUsernameIgnoreCase(username)
				.orElseThrow(() -> new ResourceNotFoundException("Aktueller Benutzer wurde nicht gefunden."));
	}

	private void validateAccess(ChatConversation conversation, User user) {
		if (hasAdministrationRole(user)) {
			return;
		}

		if (conversation.getType() == ChatConversationType.TEAM && conversation.getTeam() != null
				&& isUserMemberOfTeam(conversation.getTeam().getId(), user.getUsername())) {
			return;
		}

		throw new AccessDeniedException("Du hast keinen Zugriff auf diesen Chat.");
	}

	private boolean isUserMemberOfTeam(Long teamId, String username) {
		return teamMembershipRepository.existsByTeamIdAndMemberUserUsernameIgnoreCase(teamId, username);
	}

	private boolean hasAdministrationRole(User user) {
		return user.getRoles().contains(GlobalRole.ADMIN) || user.getRoles().contains(GlobalRole.BOARD);
	}

	private String normalizeRequiredText(String value) {
		String normalizedValue = value == null ? "" : value.trim();

		if (normalizedValue.isEmpty()) {
			throw new IllegalArgumentException("Nachricht darf nicht leer sein.");
		}

		return normalizedValue;
	}

	private ChatConversationResponse toConversationResponse(ChatConversation conversation) {
		Long teamId = conversation.getTeam() != null ? conversation.getTeam().getId() : null;
		String teamName = conversation.getTeam() != null ? conversation.getTeam().getName() : null;
		String title = conversation.getType() == ChatConversationType.TEAM && teamName != null ? teamName : "Chat";

		return new ChatConversationResponse(conversation.getId(), conversation.getType(), teamId, teamName, title,
				conversation.getCreatedAt());
	}

	private ChatMessageResponse toMessageResponse(ChatMessage message) {
		return new ChatMessageResponse(message.getId(), message.getConversation().getId(), message.getSender().getId(),
				message.getSender().getFullName(), message.getContent(), message.getCreatedAt());
	}
}