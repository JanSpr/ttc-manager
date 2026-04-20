package de.janek.ttc.manager.domain.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request-DTO für Login.
 */
public class LoginRequest {

	@NotBlank(message = "Die E-Mail-Adresse darf nicht leer sein.")
	@Email(message = "Die E-Mail-Adresse ist ungültig.")
	@Size(max = 255, message = "Die E-Mail-Adresse darf maximal 255 Zeichen lang sein.")
	private String email;

	@NotBlank(message = "Das Passwort darf nicht leer sein.")
	@Size(max = 255, message = "Das Passwort darf maximal 255 Zeichen lang sein.")
	private String password;

	public LoginRequest() {
	}

	public String getEmail() {
		return email;
	}

	public String getPassword() {
		return password;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}