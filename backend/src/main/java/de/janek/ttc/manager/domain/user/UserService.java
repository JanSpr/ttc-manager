package de.janek.ttc.manager.domain.user;

import de.janek.ttc.manager.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service für Benutzerverwaltung.
 *
 * Aktueller Zwischenstand: - verwaltet nur noch User / Login-Konten - keine
 * direkte Team-Zuordnung mehr - globale Rollen statt alter Einzelrolle
 */
@Service
@Transactional
public class UserService {

	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * Liefert alle Benutzer.
	 *
	 * @return Liste aller Benutzer als Response-DTOs
	 */
	@Transactional(readOnly = true)
	public List<UserResponse> findAll() {
		return userRepository.findAll(Sort.by("id")).stream().map(this::toResponse).toList();
	}

	/**
	 * Liefert einen Benutzer anhand seiner ID.
	 *
	 * @param id Benutzer-ID
	 * @return Benutzer als Response-DTO
	 */
	@Transactional(readOnly = true)
	public UserResponse findById(Long id) {
		return toResponse(getUserEntityById(id));
	}

	/**
	 * Erstellt einen neuen Benutzer.
	 *
	 * @param request Request-Daten
	 * @return gespeicherter Benutzer als Response-DTO
	 */
	public UserResponse create(CreateUserRequest request) {
		validateUniqueEmail(request.getEmail(), null);

		User user = new User();
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setEmail(request.getEmail());
		user.setPasswordHash(request.getPasswordHash());
		user.setActive(request.getActive());
		user.setRoles(copyRoles(request.getRoles()));

		User savedUser = userRepository.save(user);
		return toResponse(savedUser);
	}

	/**
	 * Aktualisiert einen bestehenden Benutzer.
	 *
	 * @param id      Benutzer-ID
	 * @param request neue Benutzerdaten
	 * @return aktualisierter Benutzer als Response-DTO
	 */
	public UserResponse update(Long id, CreateUserRequest request) {
		User existingUser = getUserEntityById(id);

		validateUniqueEmail(request.getEmail(), id);

		existingUser.setFirstName(request.getFirstName());
		existingUser.setLastName(request.getLastName());
		existingUser.setEmail(request.getEmail());
		existingUser.setPasswordHash(request.getPasswordHash());
		existingUser.setActive(request.getActive());
		existingUser.setRoles(copyRoles(request.getRoles()));

		User savedUser = userRepository.save(existingUser);
		return toResponse(savedUser);
	}

	/**
	 * Löscht einen Benutzer.
	 *
	 * Hinweis: Team-Zuordnungen hängen künftig nicht mehr direkt am User, sondern
	 * später über Member / TeamMembership.
	 *
	 * @param id Benutzer-ID
	 */
	public void delete(Long id) {
		User user = getUserEntityById(id);
		userRepository.delete(user);
	}

	/**
	 * Lädt ein User-Entity anhand seiner ID.
	 *
	 * @param id Benutzer-ID
	 * @return User-Entity
	 */
	private User getUserEntityById(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User mit ID " + id + " wurde nicht gefunden."));
	}

	/**
	 * Prüft, ob eine E-Mail-Adresse bereits durch einen anderen Benutzer belegt
	 * ist.
	 *
	 * @param email         gewünschte E-Mail-Adresse
	 * @param currentUserId ID des aktuell bearbeiteten Benutzers; bei Neuanlage
	 *                      null
	 */
	private void validateUniqueEmail(String email, Long currentUserId) {
		userRepository.findByEmail(email).ifPresent(existingUser -> {
			boolean isDifferentUser = currentUserId == null || !existingUser.getId().equals(currentUserId);

			if (isDifferentUser) {
				throw new IllegalArgumentException(
						"Ein Benutzer mit der E-Mail-Adresse '" + email + "' existiert bereits.");
			}
		});
	}

	/**
	 * Erstellt eine defensive Kopie der Rollenmenge.
	 *
	 * @param roles Rollen aus dem Request
	 * @return kopierte Rollenmenge, niemals null
	 */
	private Set<GlobalRole> copyRoles(Set<GlobalRole> roles) {
		return roles != null ? new HashSet<>(roles) : new HashSet<>();
	}

	/**
	 * Wandelt ein User-Entity in ein Response-DTO um.
	 *
	 * @param user User-Entity
	 * @return UserResponse
	 */
	private UserResponse toResponse(User user) {
		return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getFullName(),
				user.getEmail(), user.isActive(), Set.copyOf(user.getRoles()));
	}
}