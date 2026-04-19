package de.janek.ttc.manager.domain.user;

import de.janek.ttc.manager.domain.member.Member;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Repräsentiert einen Benutzer (Login-Konto).
 *
 * WICHTIG: - Kein direkter Team-Bezug - Nur globale Rollen - Optional mit genau
 * einem Member verknüpft
 */
@Entity
@Table(name = "app_user")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * Vorname des Benutzers.
	 *
	 * Hinweis: Diese Felder bleiben vorerst im User bestehen, auch wenn die
	 * fachliche Person künftig primär über Member modelliert wird.
	 */
	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;

	/**
	 * Nachname des Benutzers.
	 */
	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;

	/**
	 * E-Mail-Adresse (Login).
	 */
	@Column(name = "email", length = 255, unique = true)
	private String email;

	/**
	 * Passwort-Hash.
	 */
	@Column(name = "password_hash", length = 255)
	private String passwordHash;

	/**
	 * Globale Rollen.
	 */
	@ElementCollection(targetClass = GlobalRole.class)
	@Enumerated(EnumType.STRING)
	@CollectionTable(name = "user_global_role", joinColumns = @JoinColumn(name = "user_id"))
	@Column(name = "role")
	private Set<GlobalRole> roles = new HashSet<>();

	/**
	 * Konto aktiv / deaktiviert.
	 */
	@Column(name = "active", nullable = false)
	private boolean active = true;

	/**
	 * Optional verknüpftes Member.
	 *
	 * Die fachliche Person liegt in der Member-Domäne. Die Join-Spalte liegt auf
	 * der Member-Seite.
	 */
	@OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
	private Member member;

	public User() {
	}

	public User(String firstName, String lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.active = true;
	}

	public User(String firstName, String lastName, String email, String passwordHash) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.passwordHash = passwordHash;
		this.active = true;
	}

	public Long getId() {
		return id;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getFullName() {
		return firstName + " " + lastName;
	}

	public String getEmail() {
		return email;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public Set<GlobalRole> getRoles() {
		return roles;
	}

	public boolean isActive() {
		return active;
	}

	public Member getMember() {
		return member;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public void setRoles(Set<GlobalRole> roles) {
		this.roles = roles;
	}

	public void addRole(GlobalRole role) {
		this.roles.add(role);
	}

	public void removeRole(GlobalRole role) {
		this.roles.remove(role);
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public void setMember(Member member) {
		this.member = member;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof User appUser))
			return false;
		return id != null && Objects.equals(id, appUser.id);
	}

	@Override
	public int hashCode() {
		return getClass().hashCode();
	}
}