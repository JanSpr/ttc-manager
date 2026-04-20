package de.janek.ttc.manager.domain.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request-DTO für Login.
 *
 * identifier kann entweder eine E-Mail-Adresse oder ein Username sein.
 */
public class LoginRequest {

	@NotBlank(message = "E-Mail oder Username darf nicht leer sein.")
	@Size(max = 255, message = "E-Mail oder Username darf maximal 255 Zeichen lang sein.")
	private String identifier;

	@NotBlank(message = "Das Passwort darf nicht leer sein.")
	@Size(max = 255, message = "Das Passwort darf maximal 255 Zeichen lang sein.")
	private String password;

	public LoginRequest() {
	}

	public String getIdentifier() {
		return identifier;
	}

	public String getPassword() {
		return password;
	}

	public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}