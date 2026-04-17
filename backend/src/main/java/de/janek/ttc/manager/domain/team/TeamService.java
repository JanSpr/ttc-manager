package de.janek.ttc.manager.domain.team;

import de.janek.ttc.manager.common.exception.ResourceNotFoundException;
import de.janek.ttc.manager.domain.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service für die Verwaltung von Teams.
 *
 * Der Service enthält die Fachlogik der Team-Domäne:
 * - Laden und Speichern von Teams
 * - Prüfen fachlicher Regeln, z. B. eindeutiger Teamname
 * - Mapping zwischen Entity und Response-DTO
 */
@Service
@Transactional
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    /**
     * Liefert alle Teams.
     *
     * @return Liste aller Teams als Response-DTOs
     */
    @Transactional(readOnly = true)
    public List<TeamResponse> findAll() {
        return teamRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Liefert ein Team anhand seiner ID.
     *
     * @param id Team-ID
     * @return gefundenes Team als Response-DTO
     * @throws ResourceNotFoundException wenn kein Team mit der ID existiert
     */
    @Transactional(readOnly = true)
    public TeamResponse findById(Long id) {
        return toResponse(getTeamEntityById(id));
    }

    /**
     * Erstellt ein neues Team.
     *
     * @param request Request-Daten für das neue Team
     * @return gespeichertes Team als Response-DTO
     */
    public TeamResponse create(CreateTeamRequest request) {
        validateUniqueTeamName(request.getName(), null);

        Team team = new Team();
        team.setName(request.getName());
        team.setDescription(request.getDescription());

        Team savedTeam = teamRepository.save(team);
        return toResponse(savedTeam);
    }

    /**
     * Aktualisiert ein bestehendes Team.
     *
     * @param id Team-ID
     * @param request neue Team-Daten
     * @return aktualisiertes Team als Response-DTO
     */
    public TeamResponse update(Long id, CreateTeamRequest request) {
        Team existingTeam = getTeamEntityById(id);

        validateUniqueTeamName(request.getName(), id);

        existingTeam.setName(request.getName());
        existingTeam.setDescription(request.getDescription());

        Team savedTeam = teamRepository.save(existingTeam);
        return toResponse(savedTeam);
    }

    /**
     * Löscht ein Team.
     *
     * Vor dem Löschen werden vorhandene Benutzer-Zuordnungen entfernt,
     * damit die Many-to-Many-Beziehung sauber bleibt.
     *
     * @param id Team-ID
     */
    public void delete(Long id) {
        Team team = getTeamEntityById(id);

        for (User member : List.copyOf(team.getMembers())) {
            team.removeMember(member);
        }

        teamRepository.delete(team);
    }

    /**
     * Lädt ein Team-Entity anhand seiner ID.
     *
     * @param id Team-ID
     * @return Team-Entity
     * @throws ResourceNotFoundException wenn kein Team gefunden wurde
     */
    private Team getTeamEntityById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Team mit ID " + id + " wurde nicht gefunden."
                ));
    }

    /**
     * Prüft, ob ein Teamname bereits durch ein anderes Team belegt ist.
     *
     * @param teamName gewünschter Teamname
     * @param currentTeamId ID des aktuell bearbeiteten Teams; bei Neuanlage null
     */
    private void validateUniqueTeamName(String teamName, Long currentTeamId) {
        teamRepository.findByName(teamName).ifPresent(existingTeam -> {
            boolean isDifferentTeam = currentTeamId == null || !existingTeam.getId().equals(currentTeamId);

            if (isDifferentTeam) {
                throw new IllegalArgumentException(
                        "Ein Team mit dem Namen '" + teamName + "' existiert bereits."
                );
            }
        });
    }

    /**
     * Wandelt ein Team-Entity in ein Response-DTO um.
     *
     * @param team Team-Entity
     * @return TeamResponse
     */
    private TeamResponse toResponse(Team team) {
        return new TeamResponse(
                team.getId(),
                team.getName(),
                team.getDescription(),
                team.getMembers().size()
        );
    }
}