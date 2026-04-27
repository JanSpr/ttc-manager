package de.janek.ttc.manager.domain.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request zur Aktivierung eines vorbereiteten Benutzerkontos.
 *
 * E-Mail ist optional. Passwort ist erforderlich. Der Aktivierungscode
 * identifiziert den vorbereiteten Account.
 */
public class ActivateUserAccountRequest {

	@NotBlank(message = "Der Aktivierungscode darf nicht leer sein.")
	private String activationCode;

	@Size(max = 255, message = "Die E-Mail-Adresse darf maximal 255 Zeichen lang sein.")
	private String email;

	@NotBlank(message = "Das Passwort darf nicht leer sein.")
	@Size(min = 8, max = 255, message = "Das Passwort muss zwischen 8 und 255 Zeichen lang sein.")
	private String password;

	public String getActivationCode() {
		return activationCode;
	}

	public void setActivationCode(String activationCode) {
		this.activationCode = activationCode;
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