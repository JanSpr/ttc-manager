package de.janek.ttc.manager.domain.member;

import de.janek.ttc.manager.domain.team.TeamMembership;
import de.janek.ttc.manager.domain.user.User;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Repräsentiert eine reale Person im Verein.
 *
 * Ein Member ist die fachliche Einheit: - kann Spieler sein - kann
 * Mannschaftsführer sein - kann aktuell keinem Team angehören - kann optional
 * mit einem User (Login-Konto) verknüpft sein
 */
@Entity
@Table(name = "member")
public class Member {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * Vorname der Person.
	 */
	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;

	/**
	 * Nachname der Person.
	 */
	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;

	/**
	 * Gibt an, ob das Mitglied aktiv im Verein ist.
	 */
	@Column(name = "active", nullable = false)
	private boolean active = true;

	/**
	 * Typ des Mitglieds (Erwachsener / Jugendlicher).
	 */
	@Enumerated(EnumType.STRING)
	@Column(name = "type", nullable = false)
	private MemberType type = MemberType.ADULT;

	/**
	 * Optionaler Bezug zum User (Login-Konto).
	 */
	@OneToOne
	@JoinColumn(name = "user_id", unique = true)
	private User user;

	/**
	 * Team-Zuordnungen dieses Members.
	 */
	@OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<TeamMembership> memberships = new HashSet<>();

	public Member() {
	}

	public Member(String firstName, String lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.active = true;
		this.type = MemberType.ADULT;
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

	public boolean isActive() {
		return active;
	}

	public MemberType getType() {
		return type;
	}

	public void setType(MemberType type) {
		this.type = type;
	}

	public User getUser() {
		return user;
	}

	public Set<TeamMembership> getMemberships() {
		return memberships;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public void setUser(User user) {
		this.user = user;

		if (user != null && user.getMember() != this) {
			user.setMember(this);
		}
	}

	public void setMemberships(Set<TeamMembership> memberships) {
		this.memberships = memberships;
	}

	public String getFullName() {
		return firstName + " " + lastName;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof Member member))
			return false;
		return id != null && Objects.equals(id, member.id);
	}

	@Override
	public int hashCode() {
		return getClass().hashCode();
	}
}