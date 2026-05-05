package de.janek.ttc.manager.domain.match;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * Request-DTO zum Erstellen und Aktualisieren eines Spiels.
 */
public class CreateMatchRequest {

	@NotNull(message = "Die Team-ID ist erforderlich.")
	private Long teamId;

	@NotBlank(message = "Der Gegnername darf nicht leer sein.")
	@Size(max = 150, message = "Der Gegnername darf maximal 150 Zeichen lang sein.")
	private String opponentName;

	@Size(max = 150, message = "Der Wettbewerb darf maximal 150 Zeichen lang sein.")
	private String competition;

	@NotNull(message = "Das Spieldatum ist erforderlich.")
	@Future(message = "Das Spieldatum muss in der Zukunft liegen.")
	private LocalDateTime matchDateTime;

	@Size(max = 255, message = "Der Ort darf maximal 255 Zeichen lang sein.")
	private String location;

	@NotNull(message = "Es muss angegeben werden, ob es ein Heimspiel ist.")
	private Boolean homeMatch;

	@Size(max = 1000, message = "Die Notiz darf maximal 1000 Zeichen lang sein.")
	private String notes;

	public CreateMatchRequest() {
	}

	public Long getTeamId() {
		return teamId;
	}

	public void setTeamId(Long teamId) {
		this.teamId = teamId;
	}

	public String getOpponentName() {
		return opponentName;
	}

	public void setOpponentName(String opponentName) {
		this.opponentName = opponentName;
	}

	public String getCompetition() {
		return competition;
	}

	public void setCompetition(String competition) {
		this.competition = competition;
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

	public Boolean getHomeMatch() {
		return homeMatch;
	}

	public void setHomeMatch(Boolean homeMatch) {
		this.homeMatch = homeMatch;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}
}