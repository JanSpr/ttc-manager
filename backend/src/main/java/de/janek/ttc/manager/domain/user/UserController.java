package de.janek.ttc.manager.domain.user;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST-Controller für Benutzer.
 *
 * Aktueller Zwischenstand: - keine direkte Team-Zuordnung mehr über
 * User-Endpunkte - TeamMemberships werden über eigene Endpunkte verwaltet -
 * Self-Service-Endpunkte laufen über /api/users/me
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	/**
	 * Gibt alle Benutzer zurück.
	 *
	 * @return Liste aller Benutzer als Response-DTOs
	 */
	@GetMapping
	public List<UserResponse> getAllUsers() {
		return userService.findAll();
	}

	/**
	 * Gibt den aktuell eingeloggten Benutzer zurück.
	 *
	 * @param authentication aktuelle Spring-Security-Authentication
	 * @return aktueller Benutzer als Response-DTO
	 */
	@GetMapping("/me")
	public UserResponse getCurrentUser(Authentication authentication) {
		return userService.findCurrentUser(authentication.getName());
	}

	/**
	 * Gibt einen Benutzer anhand seiner ID zurück.
	 *
	 * @param id Benutzer-ID
	 * @return Benutzer als Response-DTO
	 */
	@GetMapping("/{id}")
	public UserResponse getUserById(@PathVariable Long id) {
		return userService.findById(id);
	}

	/**
	 * Erstellt einen neuen Benutzer.
	 *
	 * @param request Request-Daten für den neuen Benutzer
	 * @return erstellter Benutzer als Response-DTO
	 */
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
		return userService.create(request);
	}

	/**
	 * Aktualisiert einen bestehenden Benutzer.
	 *
	 * Beim Update ist das Passwort optional. Wenn kein Passwort mitgeschickt wird,
	 * bleibt das bestehende Passwort unverändert.
	 *
	 * @param id      Benutzer-ID
	 * @param request neue Benutzerdaten
	 * @return aktualisierter Benutzer als Response-DTO
	 */
	@PutMapping("/{id}")
	public UserResponse updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
		return userService.update(id, request);
	}

	/**
	 * Aktualisiert die eigenen Profildaten des aktuell eingeloggten Benutzers.
	 *
	 * @param authentication aktuelle Spring-Security-Authentication
	 * @param request        neue Profildaten
	 * @return aktualisierter Benutzer
	 */
	@PutMapping("/me")
	public UserResponse updateOwnUser(Authentication authentication, @Valid @RequestBody UpdateOwnUserRequest request) {
		return userService.updateOwnUser(authentication.getName(), request);
	}

	/**
	 * Löscht einen Benutzer.
	 *
	 * @param id Benutzer-ID
	 */
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteUser(@PathVariable Long id) {
		userService.delete(id);
	}
}