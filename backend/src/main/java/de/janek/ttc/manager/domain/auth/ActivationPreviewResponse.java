package de.janek.ttc.manager.domain.auth;

/**
 * Vorschau-Daten für einen gültigen Aktivierungscode.
 */
public class ActivationPreviewResponse {

	private String username;
	private String fullName;

	public ActivationPreviewResponse() {
	}

	public ActivationPreviewResponse(String username, String fullName) {
		this.username = username;
		this.fullName = fullName;
	}

	public String getUsername() {
		return username;
	}

	public String getFullName() {
		return fullName;
	}
}