package de.janek.ttc.manager.domain.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

/**
 * Request-DTO zum Erstellen oder Aktualisieren eines Benutzers.
 *
 * Aktueller Stand: - Namen bleiben vorerst noch im User - globale Rollen statt
 * alter UserRole - kein direkter Team-Bezug mehr
 *
 * Wichtige fachliche Klarstellung: - dieses DTO enthält das Passwort im
 * Klartext aus dem Request - das Hashing passiert erst im Service - deshalb
 * heißt das Feld bewusst "password" und nicht "passwordHash"
 */
public class CreateUserRequest {

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

	@NotBlank(message = "Das Passwort darf nicht leer sein.")
	@Size(max = 255, message = "Das Passwort darf maximal 255 Zeichen lang sein.")
	private String password;

	@NotNull(message = "Es muss angegeben werden, ob der Benutzer aktiv ist.")
	private Boolean active;

	/**
	 * Globale Rollen des Benutzers.
	 *
	 * Optional: Wenn nichts gesetzt wird, bleibt die Menge leer.
	 */
	private Set<GlobalRole> roles = new HashSet<>();

	public CreateUserRequest() {
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

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Set<GlobalRole> getRoles() {
		return roles;
	}

	public void setRoles(Set<GlobalRole> roles) {
		this.roles = roles != null ? roles : new HashSet<>();
	}
}