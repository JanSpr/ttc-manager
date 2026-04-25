package de.janek.ttc.manager.domain.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

/**
 * Request-DTO zum Erstellen eines Benutzers.
 *
 * Fachliche Regeln: - ein Benutzerkonto muss mit genau einem Member verknüpft
 * werden - E-Mail ist optional - Passwort ist optional - ohne Passwort kann der
 * Account später über einen Aktivierungsflow aktiviert werden
 */
public class CreateUserRequest {

	@NotBlank(message = "Der Vorname darf nicht leer sein.")
	@Size(max = 100, message = "Der Vorname darf maximal 100 Zeichen lang sein.")
	private String firstName;

	@NotBlank(message = "Der Nachname darf nicht leer sein.")
	@Size(max = 100, message = "Der Nachname darf maximal 100 Zeichen lang sein.")
	private String lastName;

	@Email(message = "Die E-Mail-Adresse ist ungültig.")
	@Size(max = 255, message = "Die E-Mail-Adresse darf maximal 255 Zeichen lang sein.")
	private String email;

	@Size(max = 255, message = "Das Passwort darf maximal 255 Zeichen lang sein.")
	private String password;

	@NotNull(message = "Es muss angegeben werden, ob der Benutzer aktiv ist.")
	private Boolean active;

	@NotNull(message = "Ein Benutzerkonto muss mit einem Mitglied verknüpft werden.")
	private Long memberId;

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

	public Long getMemberId() {
		return memberId;
	}

	public void setMemberId(Long memberId) {
		this.memberId = memberId;
	}

	public Set<GlobalRole> getRoles() {
		return roles;
	}

	public void setRoles(Set<GlobalRole> roles) {
		this.roles = roles != null ? roles : new HashSet<>();
	}
}