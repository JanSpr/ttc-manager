package de.janek.ttc.manager.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository für Benutzer.
 */
public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	Optional<User> findByEmailIgnoreCase(String email);

	boolean existsByEmail(String email);

	boolean existsByEmailIgnoreCase(String email);

	List<User> findAllByActiveTrue();
}