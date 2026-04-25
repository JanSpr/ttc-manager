package de.janek.ttc.manager.domain.member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Request-DTO zum Erstellen oder Aktualisieren eines Members.
 */
public class CreateMemberRequest {

	@NotBlank(message = "Der Vorname darf nicht leer sein.")
	@Size(max = 100, message = "Der Vorname darf maximal 100 Zeichen lang sein.")
	private String firstName;

	@NotBlank(message = "Der Nachname darf nicht leer sein.")
	@Size(max = 100, message = "Der Nachname darf maximal 100 Zeichen lang sein.")
	private String lastName;

	@NotNull(message = "Es muss angegeben werden, ob das Mitglied aktiv ist.")
	private Boolean active;

	@NotNull(message = "Der Member-Typ ist erforderlich.")
	private MemberType type;

	/**
	 * Optional verknüpfter bestehender User.
	 *
	 * Nicht jedes Member braucht sofort ein Login-Konto.
	 */
	private Long userId;

	/**
	 * Wenn true, wird beim Erstellen eines Members direkt ein neues Benutzerkonto
	 * vorbereitet.
	 *
	 * Wichtig: - Im Frontend soll diese Option beim Neuanlegen standardmäßig aktiv
	 * sein. - Im Backend wird nur bei explizit true ein User erzeugt. - Dadurch
	 * erzeugen Updates nicht versehentlich neue Benutzerkonten.
	 */
	private Boolean createUserAccount;

	public CreateMemberRequest() {
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

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public MemberType getType() {
		return type;
	}

	public void setType(MemberType type) {
		this.type = type;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Boolean getCreateUserAccount() {
		return createUserAccount;
	}

	public void setCreateUserAccount(Boolean createUserAccount) {
		this.createUserAccount = createUserAccount;
	}
}