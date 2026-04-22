package de.janek.ttc.manager.domain.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request-DTO für Self-Service-Änderungen des aktuell eingeloggten Benutzers.
 *
 * Regeln: - Benutzer darf seine eigene E-Mail-Adresse ändern - Passwort ist
 * optional - Vorname, Nachname, Rollen und Aktiv-Status sind NICHT enthalten
 */
public class UpdateOwnUserRequest {

	@NotBlank(message = "Die E-Mail-Adresse darf nicht leer sein.")
	@Email(message = "Die E-Mail-Adresse ist ungültig.")
	@Size(max = 255, message = "Die E-Mail-Adresse darf maximal 255 Zeichen lang sein.")
	private String email;

	@Size(max = 255, message = "Das Passwort darf maximal 255 Zeichen lang sein.")
	private String password;

	public UpdateOwnUserRequest() {
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}