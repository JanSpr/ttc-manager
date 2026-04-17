package de.janek.ttc.manager.domain.match;

import de.janek.ttc.manager.common.exception.ResourceNotFoundException;
import de.janek.ttc.manager.domain.team.Team;
import de.janek.ttc.manager.domain.team.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service für die Verwaltung von Spielen.
 *
 * Der Service enthält die Fachlogik der Match-Domäne:
 * - Laden und Speichern von Spielen
 * - Auflösen des Teams über die Team-ID aus dem Request
 * - Mapping zwischen Entity und Response-DTO
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

    /**
     * Liefert alle Spiele.
     *
     * @return Liste aller Spiele als Response-DTOs
     */
    @Transactional(readOnly = true)
    public List<MatchResponse> findAll() {
        return matchRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Liefert ein Spiel anhand seiner ID.
     *
     * @param id Match-ID
     * @return gefundenes Spiel als Response-DTO
     * @throws ResourceNotFoundException wenn kein Spiel mit der ID existiert
     */
    @Transactional(readOnly = true)
    public MatchResponse findById(Long id) {
        return toResponse(getMatchEntityById(id));
    }

    /**
     * Erstellt ein neues Spiel.
     *
     * @param request Request-Daten für das neue Spiel
     * @return gespeichertes Spiel als Response-DTO
     */
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

    /**
     * Aktualisiert ein bestehendes Spiel.
     *
     * @param id Match-ID
     * @param request neue Spiel-Daten
     * @return aktualisiertes Spiel als Response-DTO
     */
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

    /**
     * Löscht ein Spiel.
     *
     * @param id Match-ID
     */
    public void delete(Long id) {
        Match match = getMatchEntityById(id);
        matchRepository.delete(match);
    }

    /**
     * Lädt ein Match-Entity anhand seiner ID.
     *
     * @param id Match-ID
     * @return Match-Entity
     * @throws ResourceNotFoundException wenn kein Match gefunden wurde
     */
    private Match getMatchEntityById(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Match mit ID " + id + " wurde nicht gefunden."
                ));
    }

    /**
     * Lädt ein Team-Entity anhand seiner ID.
     *
     * @param teamId Team-ID
     * @return Team-Entity
     * @throws ResourceNotFoundException wenn kein Team gefunden wurde
     */
    private Team getTeamEntityById(Long teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Team mit ID " + teamId + " wurde nicht gefunden."
                ));
    }

    /**
     * Wandelt ein Match-Entity in ein Response-DTO um.
     *
     * @param match Match-Entity
     * @return MatchResponse
     */
    private MatchResponse toResponse(Match match) {
        return new MatchResponse(
                match.getId(),
                match.getTeam().getId(),
                match.getTeam().getName(),
                match.getOpponentName(),
                match.getMatchDateTime(),
                match.getLocation(),
                match.isHomeMatch(),
                match.getStatus(),
                match.getNotes()
        );
    }
}