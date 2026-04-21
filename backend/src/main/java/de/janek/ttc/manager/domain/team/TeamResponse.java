package de.janek.ttc.manager.domain.team;

import java.util.List;

/**
 * Response-DTO für Mannschaften.
 */
public class TeamResponse {

	private Long id;
	private String name;
	private String description;
	private TeamType type;
	private int memberCount;
	private List<TeamMembershipSummaryResponse> memberships;

	public TeamResponse() {
	}

	public TeamResponse(Long id, String name, String description, TeamType type, int memberCount,
			List<TeamMembershipSummaryResponse> memberships) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.type = type;
		this.memberCount = memberCount;
		this.memberships = memberships;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getDescription() {
		return description;
	}

	public TeamType getType() {
		return type;
	}

	public int getMemberCount() {
		return memberCount;
	}

	public List<TeamMembershipSummaryResponse> getMemberships() {
		return memberships;
	}
}