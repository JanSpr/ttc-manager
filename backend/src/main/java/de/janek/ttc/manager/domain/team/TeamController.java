package de.janek.ttc.manager.domain.team;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST-Controller für Teams.
 *
 * Der Controller arbeitet ausschließlich mit Request-/Response-DTOs
 * und gibt keine JPA-Entities direkt nach außen zurück.
 */
@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    /**
     * Gibt alle Teams zurück.
     *
     * @return Liste aller Teams als Response-DTOs
     */
    @GetMapping
    public List<TeamResponse> getAllTeams() {
        return teamService.findAll();
    }

    /**
     * Gibt ein Team anhand seiner ID zurück.
     *
     * @param id Team-ID
     * @return Team als Response-DTO
     */
    @GetMapping("/{id}")
    public TeamResponse getTeamById(@PathVariable Long id) {
        return teamService.findById(id);
    }

    /**
     * Erstellt ein neues Team.
     *
     * @param request Request-Daten für das neue Team
     * @return erstelltes Team als Response-DTO
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeamResponse createTeam(@Valid @RequestBody CreateTeamRequest request) {
        return teamService.create(request);
    }

    /**
     * Aktualisiert ein bestehendes Team.
     *
     * @param id Team-ID
     * @param request neue Team-Daten
     * @return aktualisiertes Team als Response-DTO
     */
    @PutMapping("/{id}")
    public TeamResponse updateTeam(@PathVariable Long id, @Valid @RequestBody CreateTeamRequest request) {
        return teamService.update(id, request);
    }

    /**
     * Löscht ein Team.
     *
     * @param id Team-ID
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeam(@PathVariable Long id) {
        teamService.delete(id);
    }
}