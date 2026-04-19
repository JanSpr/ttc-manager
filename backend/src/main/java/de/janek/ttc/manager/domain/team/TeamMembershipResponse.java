package de.janek.ttc.manager.domain.team;

/**
 * Response-DTO für TeamMemberships.
 */
public class TeamMembershipResponse {

	private Long id;
	private Long teamId;
	private String teamName;
	private Long memberId;
	private String memberFullName;
	private Integer lineupPosition;
	private boolean player;
	private boolean captain;
	private boolean viceCaptain;

	public TeamMembershipResponse() {
	}

	public TeamMembershipResponse(Long id, Long teamId, String teamName, Long memberId, String memberFullName,
			Integer lineupPosition, boolean player, boolean captain, boolean viceCaptain) {
		this.id = id;
		this.teamId = teamId;
		this.teamName = teamName;
		this.memberId = memberId;
		this.memberFullName = memberFullName;
		this.lineupPosition = lineupPosition;
		this.player = player;
		this.captain = captain;
		this.viceCaptain = viceCaptain;
	}

	public Long getId() {
		return id;
	}

	public Long getTeamId() {
		return teamId;
	}

	public String getTeamName() {
		return teamName;
	}

	public Long getMemberId() {
		return memberId;
	}

	public String getMemberFullName() {
		return memberFullName;
	}

	public Integer getLineupPosition() {
		return lineupPosition;
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
}