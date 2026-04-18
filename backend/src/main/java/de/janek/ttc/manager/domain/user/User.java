package de.janek.ttc.manager.domain.user;

import de.janek.ttc.manager.domain.team.Team;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Repräsentiert einen Benutzer der TTC-App.
 *
 * Für den MVP enthält der Benutzer:
 * - Stammdaten
 * - Login-relevante Basisdaten (noch ohne Security-Implementierung)
 * - Zugehörigkeit zu einem oder mehreren Teams
 *
 * Hinweis:
 * Die Many-to-Many-Beziehung ist für den Start flexibel.
 * Falls später fachlich gilt "ein Spieler gehört genau einem Team",
 * kann das leicht auf Many-to-One umgestellt werden.
 */
@Entity
@Table(
        name = "app_user"
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Vorname des Benutzers.
     */
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    /**
     * Nachname des Benutzers.
     */
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    /**
     * Eindeutige E-Mail-Adresse.
     */
    @Column(name = "email", length = 255, unique = true)
    private String email;

    /**
     * Passwort-Hash.
     * Für jetzt nur als Feld vorgesehen, später mit Spring Security nutzbar.
     */
    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    /**
     * Rolle des Benutzers.
     * Aktuell PLAYER als Standard-Wert
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 30)
    private UserRole role = UserRole.PLAYER;

    /**
     * Gibt an, ob der Benutzer aktiv ist.
     */
    @Column(name = "active", nullable = false)
    private boolean active = true;

    /**
     * Teams, denen der Benutzer angehört.
     */
    @ManyToMany
    @JoinTable(
            name = "team_member",
            joinColumns = @JoinColumn(name = "user_id", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "team_id", nullable = false)
    )
    private Set<Team> teams = new HashSet<>();

    public User() {
    }
    
    public User(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = UserRole.PLAYER;
        this.active = true;
    }

    public User(String firstName, String lastName, String email, String passwordHash, UserRole role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role != null ? role : UserRole.PLAYER;
        this.active = true;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Set<Team> getTeams() {
        return teams;
    }

    public void setTeams(Set<Team> teams) {
        this.teams = teams;
    }

    public void addTeam(Team team) {
        this.teams.add(team);
        team.getMembers().add(this);
    }

    public void removeTeam(Team team) {
        this.teams.remove(team);
        team.getMembers().remove(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User appUser)) return false;
        return id != null && Objects.equals(id, appUser.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}