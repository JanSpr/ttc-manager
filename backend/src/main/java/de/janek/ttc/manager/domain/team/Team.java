package de.janek.ttc.manager.domain.team;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Repräsentiert eine Mannschaft.
 *
 * Enthält: - Basisdaten - TeamMemberships (statt direkter User-Zuordnung)
 */
@Entity
@Table(name = "team", uniqueConstraints = { @UniqueConstraint(name = "uk_team_name", columnNames = "name") })
public class Team {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * Anzeigename der Mannschaft.
	 */
	@Column(name = "name", nullable = false, length = 150)
	private String name;

	/**
	 * Optionale Beschreibung.
	 */
	@Column(name = "description", length = 500)
	private String description;

	/**
	 * Typ der Mannschaft (Erwachsene / Jugend).
	 */
	@Enumerated(EnumType.STRING)
	@Column(name = "type", nullable = false)
	private TeamType type = TeamType.ADULT;

	/**
	 * Neue Team-Zuordnungen.
	 */
	@OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<TeamMembership> memberships = new HashSet<>();

	public Team() {
	}

	public Team(String name, String description) {
		this.name = name;
		this.description = description;
		this.type = TeamType.ADULT;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public Set<TeamMembership> getMemberships() {
		return memberships;
	}

	public void setMemberships(Set<TeamMembership> memberships) {
		this.memberships = memberships;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public TeamType getType() {
		return type;
	}

	public void setType(TeamType type) {
		this.type = type;
	}

	/**
	 * Convenience-Methode zum Hinzufügen einer Membership.
	 */
	public void addMembership(TeamMembership membership) {
		memberships.add(membership);
		membership.setTeam(this);
	}

	/**
	 * Convenience-Methode zum Entfernen einer Membership.
	 */
	public void removeMembership(TeamMembership membership) {
		memberships.remove(membership);
		membership.setTeam(null);
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof Team team))
			return false;
		return id != null && Objects.equals(id, team.id);
	}

	@Override
	public int hashCode() {
		return getClass().hashCode();
	}
}