package de.janek.ttc.manager.domain.match;

import de.janek.ttc.manager.domain.team.Team;
import de.janek.ttc.manager.domain.team.TeamRepository;
import de.janek.ttc.manager.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service für die Verwaltung von Spielen.
 */
@Service
@Transactional
public class MatchService {

	private final MatchRepository matchRepository;
	private final TeamRepository teamRepository;

	public MatchService(MatchRepository matchRepository, TeamRepository teamRepository) {
		this.matchRepository = matchRepository;
		this.teamRepository = teamRepository;
	}

	@Transactional(readOnly = true)
	public List<MatchResponse> findAll() {
		return matchRepository.findAll().stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public MatchResponse findById(Long id) {
		return toResponse(getMatchEntityById(id));
	}

	public MatchResponse create(CreateMatchRequest request) {
		Team team = getTeamEntityById(request.getTeamId());

		Match match = new Match();
		match.setTeam(team);
		match.setOpponentName(request.getOpponentName());
		match.setMatchDateTime(request.getMatchDateTime());
		match.setLocation(request.getLocation());
		match.setHomeMatch(request.getHomeMatch());
		match.setNotes(request.getNotes());
		match.setStatus(MatchStatus.PLANNED);

		Match savedMatch = matchRepository.save(match);
		return toResponse(savedMatch);
	}

	public MatchResponse update(Long id, CreateMatchRequest request) {
		Match existingMatch = getMatchEntityById(id);
		Team team = getTeamEntityById(request.getTeamId());

		existingMatch.setTeam(team);
		existingMatch.setOpponentName(request.getOpponentName());
		existingMatch.setMatchDateTime(request.getMatchDateTime());
		existingMatch.setLocation(request.getLocation());
		existingMatch.setHomeMatch(request.getHomeMatch());
		existingMatch.setNotes(request.getNotes());

		Match savedMatch = matchRepository.save(existingMatch);
		return toResponse(savedMatch);
	}

	public void delete(Long id) {
		Match match = getMatchEntityById(id);
		matchRepository.delete(match);
	}

	// =========================
	// 🔹 NEU: UPCOMING MATCHES
	// =========================

	@Transactional(readOnly = true)
	public List<MatchResponse> findUpcoming() {
		return matchRepository.findAllByMatchDateTimeAfterAndStatusInOrderByMatchDateTimeAsc(LocalDateTime.now(),
				List.of(MatchStatus.PLANNED, MatchStatus.CONFIRMED)).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<MatchResponse> findUpcomingByTeam(Long teamId) {
		return matchRepository.findAllByTeamIdAndMatchDateTimeAfterAndStatusInOrderByMatchDateTimeAsc(teamId,
				LocalDateTime.now(), List.of(MatchStatus.PLANNED, MatchStatus.CONFIRMED)).stream().map(this::toResponse)
				.toList();
	}

	// =========================

	private Match getMatchEntityById(Long id) {
		return matchRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Match mit ID " + id + " wurde nicht gefunden."));
	}

	private Team getTeamEntityById(Long teamId) {
		return teamRepository.findById(teamId)
				.orElseThrow(() -> new ResourceNotFoundException("Team mit ID " + teamId + " wurde nicht gefunden."));
	}

	private MatchResponse toResponse(Match match) {
		return new MatchResponse(match.getId(), match.getTeam().getId(), match.getTeam().getName(),
				match.getOpponentName(), match.getMatchDateTime(), match.getLocation(), match.isHomeMatch(),
				match.getStatus(), match.getNotes());
	}
}