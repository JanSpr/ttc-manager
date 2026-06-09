package de.janek.ttc.manager.domain.chat;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST-Controller für Chats.
 */
@RestController
@RequestMapping("/api/chats")
public class ChatController {

	private final ChatService chatService;

	public ChatController(ChatService chatService) {
		this.chatService = chatService;
	}

	@GetMapping
	public List<ChatConversationResponse> getVisibleConversations(Authentication authentication) {
		return chatService.findVisibleConversations(authentication.getName());
	}

	@GetMapping("/{conversationId}/messages")
	public List<ChatMessageResponse> getMessages(@PathVariable Long conversationId, Authentication authentication) {
		return chatService.findMessages(conversationId, authentication.getName());
	}

	@PostMapping("/{conversationId}/messages")
	@ResponseStatus(HttpStatus.CREATED)
	public ChatMessageResponse createMessage(@PathVariable Long conversationId, Authentication authentication,
			@Valid @RequestBody CreateChatMessageRequest request) {
		return chatService.createMessage(conversationId, authentication.getName(), request);
	}
}