package de.janek.ttc.manager.domain.match;

import java.time.LocalDateTime;

/**
 * Response-DTO für Spiele.
 */
public class MatchResponse {

	private Long id;
	private Long teamId;
	private String teamName;
	private String opponentName;
	private LocalDateTime matchDateTime;
	private String location;
	private boolean homeMatch;
	private MatchStatus status;
	private String notes;

	public MatchResponse() {
	}

	public MatchResponse(Long id, Long teamId, String teamName, String opponentName, LocalDateTime matchDateTime,
			String location, boolean homeMatch, MatchStatus status, String notes) {
		this.id = id;
		this.teamId = teamId;
		this.teamName = teamName;
		this.opponentName = opponentName;
		this.matchDateTime = matchDateTime;
		this.location = location;
		this.homeMatch = homeMatch;
		this.status = status;
		this.notes = notes;
	}

	public Long getId() {
		return id;
	}

	public Long getTeamId() {
		return teamId;
	}

	public String getTeamName() {
		return teamName;
	}

	public String getOpponentName() {
		return opponentName;
	}

	public LocalDateTime getMatchDateTime() {
		return matchDateTime;
	}

	public String getLocation() {
		return location;
	}

	public boolean isHomeMatch() {
		return homeMatch;
	}

	public MatchStatus getStatus() {
		return status;
	}

	public String getNotes() {
		return notes;
	}
}