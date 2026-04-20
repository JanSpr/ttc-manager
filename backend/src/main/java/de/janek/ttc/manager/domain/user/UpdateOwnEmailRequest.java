package de.janek.ttc.manager.domain.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request-DTO zum Aktualisieren der eigenen E-Mail-Adresse.
 *
 * Bewusst klein gehalten: - aktuell nur ein Feld - nur für den
 * Self-Service-Fall des eingeloggten Benutzers
 */
public class UpdateOwnEmailRequest {

	@NotBlank(message = "Die E-Mail-Adresse darf nicht leer sein.")
	@Email(message = "Die E-Mail-Adresse ist ungültig.")
	@Size(max = 255, message = "Die E-Mail-Adresse darf maximal 255 Zeichen lang sein.")
	private String email;

	public UpdateOwnEmailRequest() {
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}