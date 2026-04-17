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
    private UserRole role;
    private boolean active;
    private Set<Long> teamIds;

    public UserResponse() {
    }

    public UserResponse(Long id,
                        String firstName,
                        String lastName,
                        String fullName,
                        String email,
                        UserRole role,
                        boolean active,
                        Set<Long> teamIds) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.active = active;
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

    public String getEmail() {
        return email;
    }

    public UserRole getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }

    public Set<Long> getTeamIds() {
        return teamIds;
    }
}