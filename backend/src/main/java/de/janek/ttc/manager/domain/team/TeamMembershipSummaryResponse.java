package de.janek.ttc.manager.domain.team;

/**
 * Kompakte Darstellung einer TeamMembership innerhalb eines TeamResponse.
 */
public class TeamMembershipSummaryResponse {

	private Long membershipId;
	private Long memberId;
	private String memberFullName;
	private Long userId;
	private boolean accountActivated;
	private Integer lineupPosition;
	private boolean player;
	private boolean captain;
	private boolean viceCaptain;

	public TeamMembershipSummaryResponse() {
	}

	public TeamMembershipSummaryResponse(Long membershipId, Long memberId, String memberFullName, Long userId,
			boolean accountActivated, Integer lineupPosition, boolean player, boolean captain, boolean viceCaptain) {
		this.membershipId = membershipId;
		this.memberId = memberId;
		this.memberFullName = memberFullName;
		this.userId = userId;
		this.accountActivated = accountActivated;
		this.lineupPosition = lineupPosition;
		this.player = player;
		this.captain = captain;
		this.viceCaptain = viceCaptain;
	}

	public Long getMembershipId() {
		return membershipId;
	}

	public Long getMemberId() {
		return memberId;
	}

	public String getMemberFullName() {
		return memberFullName;
	}

	public Long getUserId() {
		return userId;
	}

	public boolean isAccountActivated() {
		return accountActivated;
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