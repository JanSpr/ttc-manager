package de.janek.ttc.manager.domain.availability;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Request-DTO zum Setzen einer Verfügbarkeit.
 */
public class CreateAvailabilityRequest {

    @NotNull(message = "Die Match-ID ist erforderlich.")
    private Long matchId;

    @NotNull(message = "Die User-ID ist erforderlich.")
    private Long userId;

    @NotNull(message = "Der Availability-Status ist erforderlich.")
    private AvailabilityStatus status;

    @Size(max = 500, message = "Der Kommentar darf maximal 500 Zeichen lang sein.")
    private String comment;

    public CreateAvailabilityRequest() {
    }

    public Long getMatchId() {
        return matchId;
    }

    public void setMatchId(Long matchId) {
        this.matchId = matchId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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
}