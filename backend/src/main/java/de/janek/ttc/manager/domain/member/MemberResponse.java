package de.janek.ttc.manager.domain.member;

import java.util.Set;

/**
 * Response-DTO für Members.
 */
public class MemberResponse {

	private Long id;
	private String firstName;
	private String lastName;
	private String fullName;
	private boolean active;
	private MemberType type;
	private Long userId;
	private Set<Long> teamIds;

	public MemberResponse() {
	}

	public MemberResponse(Long id, String firstName, String lastName, String fullName, boolean active, MemberType type,
			Long userId, Set<Long> teamIds) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.fullName = fullName;
		this.active = active;
		this.type = type;
		this.userId = userId;
		this.teamIds = teamIds;
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
		return fullName;
	}

	public boolean isActive() {
		return active;
	}

	public MemberType getType() {
		return type;
	}

	public Long getUserId() {
		return userId;
	}

	public Set<Long> getTeamIds() {
		return teamIds;
	}
}