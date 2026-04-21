package de.janek.ttc.manager.domain.availability;

import de.janek.ttc.manager.domain.match.Match;
import de.janek.ttc.manager.domain.match.MatchRepository;
import de.janek.ttc.manager.domain.user.User;
import de.janek.ttc.manager.domain.user.UserRepository;
import de.janek.ttc.manager.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service für die Verwaltung von Verfügbarkeitsmeldungen.
 *
 * Der Service enthält die Fachlogik der Availability-Domäne:
 * - Laden und Speichern von Verfügbarkeiten
 * - Auflösen von Match und Benutzer über ihre IDs
 * - Sicherstellen, dass pro Spiel und Benutzer genau eine Rückmeldung existiert
 * - Mapping zwischen Entity und Response-DTO
 */
@Service
@Transactional
public class AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public AvailabilityService(AvailabilityRepository availabilityRepository,
                               MatchRepository matchRepository,
                               UserRepository userRepository) {
        this.availabilityRepository = availabilityRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    /**
     * Liefert alle Verfügbarkeitsmeldungen.
     *
     * @return Liste aller Verfügbarkeiten als Response-DTOs
     */
    @Transactional(readOnly = true)
    public List<AvailabilityResponse> findAll() {
        return availabilityRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Liefert eine Verfügbarkeitsmeldung anhand ihrer ID.
     *
     * @param id Availability-ID
     * @return gefundene Verfügbarkeitsmeldung als Response-DTO
     */
    @Transactional(readOnly = true)
    public AvailabilityResponse findById(Long id) {
        return toResponse(getAvailabilityEntityById(id));
    }

    /**
     * Setzt die Verfügbarkeit eines Benutzers für ein Spiel.
     *
     * Existiert bereits eine Rückmeldung für dieselbe Kombination aus Match
     * und Benutzer, wird diese aktualisiert. Andernfalls wird eine neue
     * Rückmeldung angelegt.
     *
     * @param request Verfügbarkeitsdaten
     * @return gespeicherte Verfügbarkeitsmeldung als Response-DTO
     */
    public AvailabilityResponse setAvailability(CreateAvailabilityRequest request) {
        Match match = getMatchEntityById(request.getMatchId());
        User user = getUserEntityById(request.getUserId());

        Availability availability = availabilityRepository
                .findByMatchIdAndUserId(request.getMatchId(), request.getUserId())
                .orElseGet(() -> new Availability(match, user, request.getStatus(), request.getComment()));

        availability.setMatch(match);
        availability.setUser(user);
        availability.setStatus(request.getStatus());
        availability.setComment(request.getComment());

        Availability savedAvailability = availabilityRepository.save(availability);
        return toResponse(savedAvailability);
    }

    /**
     * Aktualisiert eine bestehende Verfügbarkeitsmeldung anhand ihrer ID.
     *
     * @param id Availability-ID
     * @param request neue Verfügbarkeitsdaten
     * @return aktualisierte Verfügbarkeitsmeldung als Response-DTO
     */
    public AvailabilityResponse update(Long id, CreateAvailabilityRequest request) {
        Availability existingAvailability = getAvailabilityEntityById(id);
        Match match = getMatchEntityById(request.getMatchId());
        User user = getUserEntityById(request.getUserId());

        existingAvailability.setMatch(match);
        existingAvailability.setUser(user);
        existingAvailability.setStatus(request.getStatus());
        existingAvailability.setComment(request.getComment());

        Availability savedAvailability = availabilityRepository.save(existingAvailability);
        return toResponse(savedAvailability);
    }

    /**
     * Löscht eine Verfügbarkeitsmeldung.
     *
     * @param id Availability-ID
     */
    public void delete(Long id) {
        Availability availability = getAvailabilityEntityById(id);
        availabilityRepository.delete(availability);
    }

    /**
     * Lädt eine Verfügbarkeits-Entity anhand ihrer ID.
     *
     * @param id Availability-ID
     * @return Availability-Entity
     */
    private Availability getAvailabilityEntityById(Long id) {
        return availabilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Availability mit ID " + id + " wurde nicht gefunden."
                ));
    }

    /**
     * Lädt ein Match-Entity anhand seiner ID.
     *
     * @param matchId Match-ID
     * @return Match-Entity
     */
    private Match getMatchEntityById(Long matchId) {
        return matchRepository.findById(matchId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Match mit ID " + matchId + " wurde nicht gefunden."
                ));
    }

    /**
     * Lädt ein User-Entity anhand seiner ID.
     *
     * @param userId User-ID
     * @return User-Entity
     */
    private User getUserEntityById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User mit ID " + userId + " wurde nicht gefunden."
                ));
    }

    /**
     * Wandelt eine Availability-Entity in ein Response-DTO um.
     *
     * @param availability Availability-Entity
     * @return AvailabilityResponse
     */
    private AvailabilityResponse toResponse(Availability availability) {
        return new AvailabilityResponse(
                availability.getId(),
                availability.getMatch().getId(),
                availability.getUser().getId(),
                availability.getUser().getFullName(),
                availability.getStatus(),
                availability.getComment(),
                availability.getRespondedAt()
        );
    }
}