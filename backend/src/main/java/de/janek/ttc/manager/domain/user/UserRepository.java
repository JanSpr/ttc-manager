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

	Optional<User> findByUsernameIgnoreCase(String username);

	Optional<User> findByEmailIgnoreCaseOrUsernameIgnoreCase(String email, String username);

	Optional<User> findByActivationCode(String activationCode);

	boolean existsByEmail(String email);

	boolean existsByEmailIgnoreCase(String email);

	boolean existsByUsernameIgnoreCase(String username);

	List<User> findAllByActiveTrue();
}