package de.janek.ttc.manager.domain.availability;

import de.janek.ttc.manager.domain.match.Match;
import de.janek.ttc.manager.domain.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Rückmeldung eines Benutzers zu einem Spiel.
 *
 * Ein Benutzer soll pro Spiel genau eine Verfügbarkeitsmeldung haben.
 * Deshalb gibt es eine Unique-Constraint auf (match_id, user_id).
 */
@Entity
@Table(
        name = "availability",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_availability_match_user",
                        columnNames = {"match_id", "user_id"}
                )
        }
)
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Das Spiel, auf das sich die Rückmeldung bezieht.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "match_id", nullable = false)
    private Match match;

    /**
     * Der Benutzer, der die Rückmeldung abgegeben hat.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Verfügbarkeitsstatus.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private AvailabilityStatus status;

    /**
     * Optionaler Kommentar.
     */
    @Column(name = "comment", length = 500)
    private String comment;

    /**
     * Zeitpunkt der letzten Änderung.
     */
    @Column(name = "responded_at", nullable = false)
    private LocalDateTime respondedAt;

    public Availability() {
    }

    public Availability(Match match, User user, AvailabilityStatus status, String comment) {
        this.match = match;
        this.user = user;
        this.status = status;
        this.comment = comment;
        this.respondedAt = LocalDateTime.now();
    }

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.respondedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Match getMatch() {
        return match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public AvailabilityStatus getStatus() {
        return status;
    }

    public void setStatus(AvailabilityStatus status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Availability that)) return false;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}