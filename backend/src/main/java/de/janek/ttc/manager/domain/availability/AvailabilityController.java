package de.janek.ttc.manager.domain.availability;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST-Controller für Verfügbarkeitsmeldungen.
 *
 * Der Controller arbeitet ausschließlich mit Request-/Response-DTOs
 * und gibt keine JPA-Entities direkt nach außen zurück.
 */
@RestController
@RequestMapping("/api/availabilities")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    /**
     * Gibt alle Verfügbarkeitsmeldungen zurück.
     *
     * @return Liste aller Verfügbarkeiten als Response-DTOs
     */
    @GetMapping
    public List<AvailabilityResponse> getAllAvailabilities() {
        return availabilityService.findAll();
    }

    /**
     * Gibt eine Verfügbarkeitsmeldung anhand ihrer ID zurück.
     *
     * @param id Availability-ID
     * @return Verfügbarkeitsmeldung als Response-DTO
     */
    @GetMapping("/{id}")
    public AvailabilityResponse getAvailabilityById(@PathVariable Long id) {
        return availabilityService.findById(id);
    }

    /**
     * Setzt die Verfügbarkeit eines Benutzers für ein Spiel.
     *
     * Existiert bereits eine Rückmeldung für dieselbe Kombination aus
     * Match und Benutzer, wird diese aktualisiert. Andernfalls wird
     * eine neue Rückmeldung angelegt.
     *
     * @param request Verfügbarkeitsdaten
     * @return gespeicherte Verfügbarkeitsmeldung als Response-DTO
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AvailabilityResponse setAvailability(@Valid @RequestBody CreateAvailabilityRequest request) {
        return availabilityService.setAvailability(request);
    }

    /**
     * Aktualisiert eine bestehende Verfügbarkeitsmeldung anhand ihrer ID.
     *
     * @param id Availability-ID
     * @param request neue Verfügbarkeitsdaten
     * @return aktualisierte Verfügbarkeitsmeldung als Response-DTO
     */
    @PutMapping("/{id}")
    public AvailabilityResponse updateAvailability(@PathVariable Long id,
                                                   @Valid @RequestBody CreateAvailabilityRequest request) {
        return availabilityService.update(id, request);
    }

    /**
     * Löscht eine Verfügbarkeitsmeldung.
     *
     * @param id Availability-ID
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAvailability(@PathVariable Long id) {
        availabilityService.delete(id);
    }
}