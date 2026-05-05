package de.janek.ttc.manager.domain.user;

import java.util.Set;

/**
 * Response-DTO für Benutzer.
 */
public class UserResponse {

	private Long id;
	private String firstName;
	private String lastName;
	private String fullName;
	private String username;
	private String email;
	private boolean active;
	private Set<GlobalRole> roles;
	private Long memberId;
	private String memberFullName;
	private String activationCode;
	private Set<Long> teamIds;

	public UserResponse() {
	}

	public UserResponse(Long id, String firstName, String lastName, String fullName, String username, String email,
			boolean active, Set<GlobalRole> roles, Long memberId, String memberFullName, String activationCode,
			Set<Long> teamIds) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.fullName = fullName;
		this.username = username;
		this.email = email;
		this.active = active;
		this.roles = roles;
		this.memberId = memberId;
		this.memberFullName = memberFullName;
		this.activationCode = activationCode;
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

	public String getUsername() {
		return username;
	}

	public String getEmail() {
		return email;
	}

	public boolean isActive() {
		return active;
	}

	public Set<GlobalRole> getRoles() {
		return roles;
	}

	public Long getMemberId() {
		return memberId;
	}

	public String getMemberFullName() {
		return memberFullName;
	}

	public String getActivationCode() {
		return activationCode;
	}

	public Set<Long> getTeamIds() {
		return teamIds;
	}
}