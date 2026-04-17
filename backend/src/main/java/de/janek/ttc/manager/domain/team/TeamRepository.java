package de.janek.ttc.manager.domain.team;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository für Mannschaften.
 */
public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByName(String name);

    boolean existsByName(String name);
}