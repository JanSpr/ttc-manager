package de.janek.ttc.manager.domain.match;

import de.janek.ttc.manager.domain.team.Team;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Repräsentiert ein Spiel einer Mannschaft.
 *
 * MVP-Fokus:
 * - Welches Team spielt?
 * - Wann findet das Spiel statt?
 * - Gegen wen?
 * - Wo?
 * - Heim/Auswärts
 * - Status
 */
@Entity
@Table(name = "match_event")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Das eigene Team, zu dem das Spiel gehört.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    /**
     * Gegnername.
     * Für den MVP reicht ein String.
     * Später könnte daraus eine eigene Opponent-/Club-Entity werden.
     */
    @Column(name = "opponent_name", nullable = false, length = 150)
    private String opponentName;

    /**
     * Zeitpunkt des Spiels.
     */
    @Column(name = "match_date_time", nullable = false)
    private LocalDateTime matchDateTime;

    /**
     * Spielort.
     */
    @Column(name = "location", length = 255)
    private String location;

    /**
     * Heimspiel oder Auswärtsspiel.
     */
    @Column(name = "home_match", nullable = false)
    private boolean homeMatch;

    /**
     * Status des Spiels.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private MatchStatus status = MatchStatus.PLANNED;

    /**
     * Freitext-Notiz.
     */
    @Column(name = "notes", length = 1000)
    private String notes;

    public Match() {
    }

    public Match(Team team, String opponentName, LocalDateTime matchDateTime, String location, boolean homeMatch) {
        this.team = team;
        this.opponentName = opponentName;
        this.matchDateTime = matchDateTime;
        this.location = location;
        this.homeMatch = homeMatch;
        this.status = MatchStatus.PLANNED;
    }

    public Long getId() {
        return id;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public String getOpponentName() {
        return opponentName;
    }

    public void setOpponentName(String opponentName) {
        this.opponentName = opponentName;
    }

    public LocalDateTime getMatchDateTime() {
        return matchDateTime;
    }

    public void setMatchDateTime(LocalDateTime matchDateTime) {
        this.matchDateTime = matchDateTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isHomeMatch() {
        return homeMatch;
    }

    public void setHomeMatch(boolean homeMatch) {
        this.homeMatch = homeMatch;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Match match)) return false;
        return id != null && Objects.equals(id, match.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}