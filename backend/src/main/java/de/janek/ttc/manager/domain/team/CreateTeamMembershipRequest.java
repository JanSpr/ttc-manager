package de.janek.ttc.manager.domain.team;

import jakarta.validation.constraints.NotNull;

/**
 * Request-DTO zum Erstellen oder Aktualisieren einer TeamMembership.
 */
public class CreateTeamMembershipRequest {

	@NotNull(message = "Die Member-ID ist erforderlich.")
	private Long memberId;

	@NotNull(message = "Es muss angegeben werden, ob das Member Spieler ist.")
	private Boolean player;

	@NotNull(message = "Es muss angegeben werden, ob das Member Mannschaftsführer ist.")
	private Boolean captain;

	@NotNull(message = "Es muss angegeben werden, ob das Member stellvertretender Mannschaftsführer ist.")
	private Boolean viceCaptain;

	public CreateTeamMembershipRequest() {
	}

	public Long getMemberId() {
		return memberId;
	}

	public void setMemberId(Long memberId) {
		this.memberId = memberId;
	}

	public Boolean getPlayer() {
		return player;
	}

	public void setPlayer(Boolean player) {
		this.player = player;
	}

	public Boolean getCaptain() {
		return captain;
	}

	public void setCaptain(Boolean captain) {
		this.captain = captain;
	}

	public Boolean getViceCaptain() {
		return viceCaptain;
	}

	public void setViceCaptain(Boolean viceCaptain) {
		this.viceCaptain = viceCaptain;
	}
}