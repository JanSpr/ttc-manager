package de.janek.ttc.manager.domain.availability;

import java.time.LocalDateTime;

/**
 * Response-DTO für Verfügbarkeitsrückmeldungen.
 */
public class AvailabilityResponse {

    private Long id;
    private Long matchId;
    private Long userId;
    private String userName;
    private AvailabilityStatus status;
    private String comment;
    private LocalDateTime respondedAt;

    public AvailabilityResponse() {
    }

    public AvailabilityResponse(
            Long id,
            Long matchId,
            Long userId,
            String userName,
            AvailabilityStatus status,
            String comment,
            LocalDateTime respondedAt
    ) {
        this.id = id;
        this.matchId = matchId;
        this.userId = userId;
        this.userName = userName;
        this.status = status;
        this.comment = comment;
        this.respondedAt = respondedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getMatchId() {
        return matchId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public AvailabilityStatus getStatus() {
        return status;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }
}