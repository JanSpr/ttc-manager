package de.janek.ttc.manager.domain.team;

import de.janek.ttc.manager.domain.member.Member;
import jakarta.persistence.*;

import java.util.Objects;

/**
 * Repräsentiert die Zugehörigkeit eines Members zu einem Team.
 *
 * Enthält alle teambezogenen Funktionen: - Spieler - Mannschaftsführer -
 * Stellvertretung
 */
@Entity
@Table(name = "team_membership", uniqueConstraints = {
		@UniqueConstraint(name = "uk_member_team", columnNames = { "member_id", "team_id" }) })
public class TeamMembership {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * Zugehöriges Mitglied.
	 */
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	/**
	 * Zugehöriges Team.
	 */
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "team_id", nullable = false)
	private Team team;

	/**
	 * Ist das Mitglied Spieler in diesem Team?
	 */
	@Column(name = "is_player", nullable = false)
	private boolean player = true;

	/**
	 * Ist das Mitglied Mannschaftsführer?
	 */
	@Column(name = "is_captain", nullable = false)
	private boolean captain = false;

	/**
	 * Ist das Mitglied stellvertretender Mannschaftsführer?
	 */
	@Column(name = "is_vice_captain", nullable = false)
	private boolean viceCaptain = false;

	public TeamMembership() {
	}

	public TeamMembership(Member member, Team team) {
		this.member = member;
		this.team = team;
	}

	public Long getId() {
		return id;
	}

	public Member getMember() {
		return member;
	}

	public Team getTeam() {
		return team;
	}

	public boolean isPlayer() {
		return player;
	}

	public boolean isCaptain() {
		return captain;
	}

	public boolean isViceCaptain() {
		return viceCaptain;
	}

	public void setMember(Member member) {
		this.member = member;
	}

	public void setTeam(Team team) {
		this.team = team;
	}

	public void setPlayer(boolean player) {
		this.player = player;
	}

	public void setCaptain(boolean captain) {
		this.captain = captain;
	}

	public void setViceCaptain(boolean viceCaptain) {
		this.viceCaptain = viceCaptain;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof TeamMembership that))
			return false;
		return id != null && Objects.equals(id, that.id);
	}

	@Override
	public int hashCode() {
		return getClass().hashCode();
	}
}