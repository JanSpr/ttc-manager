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
	private String email;
	private boolean active;
	private Set<GlobalRole> roles;

	public UserResponse() {
	}

	public UserResponse(Long id, String firstName, String lastName, String fullName, String email, boolean active,
			Set<GlobalRole> roles) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.fullName = fullName;
		this.email = email;
		this.active = active;
		this.roles = roles;
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

	public String getEmail() {
		return email;
	}

	public boolean isActive() {
		return active;
	}

	public Set<GlobalRole> getRoles() {
		return roles;
	}
}