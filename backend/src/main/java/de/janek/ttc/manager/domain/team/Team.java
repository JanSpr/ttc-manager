package de.janek.ttc.manager.domain.team;

import de.janek.ttc.manager.domain.user.User;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Repräsentiert eine Mannschaft.
 *
 * Für den MVP genügt:
 * - Name
 * - optionale Beschreibung
 * - Mitglieder
 *
 * Später kann ergänzt werden:
 * - Liga
 * - Saison
 * - Heimspielort
 * - verantwortlicher Mannschaftsführer als separates Feld
 */
@Entity
@Table(
        name = "team",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_team_name", columnNames = "name")
        }
)
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Anzeigename der Mannschaft.
     */
    @Column(name = "name", nullable = false, length = 150)
    private String name;

    /**
     * Optionale Beschreibung.
     */
    @Column(name = "description", length = 500)
    private String description;

    /**
     * Mitglieder der Mannschaft.
     */
    @JsonIgnore
    @ManyToMany(mappedBy = "teams")
    private Set<User> members = new HashSet<>();

    public Team() {
    }

    public Team(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Set<User> getMembers() {
        return members;
    }

    public void setMembers(Set<User> members) {
        this.members = members;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void addMember(User user) {
        this.members.add(user);
        user.getTeams().add(this);
    }

    public void removeMember(User user) {
        this.members.remove(user);
        user.getTeams().remove(this);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Team team)) return false;
        return id != null && Objects.equals(id, team.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}