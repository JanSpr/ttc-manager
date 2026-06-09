package de.janek.ttc.manager.domain.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request zum Erstellen einer neuen Chat-Nachricht.
 */
public class CreateChatMessageRequest {

	@NotBlank(message = "Nachricht darf nicht leer sein.")
	@Size(max = 2000, message = "Nachricht darf maximal 2000 Zeichen lang sein.")
	private String content;

	public CreateChatMessageRequest() {
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
}