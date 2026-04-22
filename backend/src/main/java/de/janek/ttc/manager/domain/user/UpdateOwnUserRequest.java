package de.janek.ttc.manager.domain.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request-DTO für Self-Service-Änderungen des aktuell eingeloggten Benutzers.
 *
 * Regeln: - Benutzer darf eigene Stammdaten ändern (Name, E-Mail) - Passwort
 * ist optional - Rollen und Aktiv-Status sind NICHT enthalten (nur Admin darf
 * das)
 */
public class UpdateOwnUserRequest {

	@NotBlank(message = "Der Vorname darf nicht leer sein.")
	@Size(max = 100, message = "Der Vorname darf maximal 100 Zeichen lang sein.")
	private String firstName;

	@NotBlank(message = "Der Nachname darf nicht leer sein.")
	@Size(max = 100, message = "Der Nachname darf maximal 100 Zeichen lang sein.")
	private String lastName;

	@NotBlank(message = "Die E-Mail-Adresse darf nicht leer sein.")
	@Email(message = "Die E-Mail-Adresse ist ungültig.")
	@Size(max = 255, message = "Die E-Mail-Adresse darf maximal 255 Zeichen lang sein.")
	private String email;

	@Size(max = 255, message = "Das Passwort darf maximal 255 Zeichen lang sein.")
	private String password;

	public UpdateOwnUserRequest() {
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
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