package de.janek.ttc.manager.domain.match;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST-Controller für Spiele.
 *
 * Der Controller arbeitet ausschließlich mit Request-/Response-DTOs
 * und gibt keine JPA-Entities direkt nach außen zurück.
 */
@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    /**
     * Gibt alle Spiele zurück.
     *
     * @return Liste aller Spiele als Response-DTOs
     */
    @GetMapping
    public List<MatchResponse> getAllMatches() {
        return matchService.findAll();
    }

    /**
     * Gibt ein Spiel anhand seiner ID zurück.
     *
     * @param id Match-ID
     * @return Spiel als Response-DTO
     */
    @GetMapping("/{id}")
    public MatchResponse getMatchById(@PathVariable Long id) {
        return matchService.findById(id);
    }

    /**
     * Erstellt ein neues Spiel.
     *
     * @param request Request-Daten für das neue Spiel
     * @return erstelltes Spiel als Response-DTO
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MatchResponse createMatch(@Valid @RequestBody CreateMatchRequest request) {
        return matchService.create(request);
    }

    /**
     * Aktualisiert ein bestehendes Spiel.
     *
     * @param id Match-ID
     * @param request neue Spiel-Daten
     * @return aktualisiertes Spiel als Response-DTO
     */
    @PutMapping("/{id}")
    public MatchResponse updateMatch(@PathVariable Long id, @Valid @RequestBody CreateMatchRequest request) {
        return matchService.update(id, request);
    }

    /**
     * Löscht ein Spiel.
     *
     * @param id Match-ID
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMatch(@PathVariable Long id) {
        matchService.delete(id);
    }
}