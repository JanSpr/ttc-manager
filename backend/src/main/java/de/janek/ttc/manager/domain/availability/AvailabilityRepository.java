package de.janek.ttc.manager.domain.availability;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository für Verfügbarkeitsmeldungen.
 */
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    List<Availability> findAllByMatchId(Long matchId);

    List<Availability> findAllByUserId(Long userId);

    Optional<Availability> findByMatchIdAndUserId(Long matchId, Long userId);

    boolean existsByMatchIdAndUserId(Long matchId, Long userId);

    long countByMatchIdAndStatus(Long matchId, AvailabilityStatus status);
}