package de.janek.ttc.manager.domain.user;

import de.janek.ttc.manager.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

/**
 * Service für Benutzerverwaltung.
 *
 * Aktueller Zwischenstand: - verwaltet User / Login-Konten - keine direkte
 * Team-Zuordnung - globale Rollen statt alter Einzelrolle - Passwort wird beim
 * Speichern sicher gehasht - Username wird beim Erstellen automatisch erzeugt
 */
@Service
@Transactional
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional(readOnly = true)
	public List<UserResponse> findAll() {
		return userRepository.findAll(Sort.by("id")).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public UserResponse findById(Long id) {
		return toResponse(getUserEntityById(id));
	}

	@Transactional(readOnly = true)
	public UserResponse findByEmail(String email) {
		User user = userRepository.findByEmailIgnoreCase(normalizeEmail(email)).orElseThrow(
				() -> new ResourceNotFoundException("User mit E-Mail '" + email + "' wurde nicht gefunden."));

		return toResponse(user);
	}

	@Transactional(readOnly = true)
	public UserResponse findByUsername(String username) {
		User user = userRepository.findByUsernameIgnoreCase(normalizeLoginIdentifier(username)).orElseThrow(
				() -> new ResourceNotFoundException("User mit Username '" + username + "' wurde nicht gefunden."));

		return toResponse(user);
	}

	@Transactional(readOnly = true)
	public UserResponse findByLoginIdentifier(String identifier) {
		User user = getUserEntityByLoginIdentifier(identifier);
		return toResponse(user);
	}

	@Transactional(readOnly = true)
	public User getUserEntityByLoginIdentifier(String identifier) {
		String normalizedIdentifier = normalizeLoginIdentifier(identifier);

		return userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase(normalizedIdentifier, normalizedIdentifier)
				.orElseThrow(() -> new ResourceNotFoundException(
						"User mit Login '" + identifier + "' wurde nicht gefunden."));
	}

	public UserResponse create(CreateUserRequest request) {
		validateUniqueEmail(request.getEmail(), null);

		String normalizedFirstName = request.getFirstName().trim();
		String normalizedLastName = request.getLastName().trim();
		String normalizedEmail = normalizeEmail(request.getEmail());
		String generatedUsername = generateUniqueUsername(normalizedFirstName, normalizedLastName);

		User user = new User();
		user.setFirstName(normalizedFirstName);
		user.setLastName(normalizedLastName);
		user.setUsername(generatedUsername);
		user.setEmail(normalizedEmail);
		user.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
		user.setActive(request.getActive());
		user.setRoles(copyRoles(request.getRoles()));

		User savedUser = userRepository.save(user);
		return toResponse(savedUser);
	}

	public UserResponse update(Long id, CreateUserRequest request) {
		User existingUser = getUserEntityById(id);

		validateUniqueEmail(request.getEmail(), id);

		existingUser.setFirstName(request.getFirstName().trim());
		existingUser.setLastName(request.getLastName().trim());
		existingUser.setEmail(normalizeEmail(request.getEmail()));
		existingUser.setPasswordHash(passwordEncoder.encode(request.getPasswordHash()));
		existingUser.setActive(request.getActive());
		existingUser.setRoles(copyRoles(request.getRoles()));

		/*
		 * Username bleibt bei Updates bewusst stabil. Er wird nur bei der Erstellung
		 * automatisch vergeben.
		 */
		User savedUser = userRepository.save(existingUser);
		return toResponse(savedUser);
	}

	/**
	 * Aktualisiert ausschließlich die E-Mail-Adresse des aktuell eingeloggten
	 * Benutzers.
	 *
	 * @param loginIdentifier Username oder E-Mail aus dem aktuellen
	 *                        Security-Kontext
	 * @param request         Request mit neuer E-Mail-Adresse
	 * @return aktualisierter Benutzer als Response-DTO
	 */
	public UserResponse updateOwnEmail(String loginIdentifier, UpdateOwnEmailRequest request) {
		User existingUser = getUserEntityByLoginIdentifier(loginIdentifier);

		validateUniqueEmail(request.getEmail(), existingUser.getId());

		existingUser.setEmail(normalizeEmail(request.getEmail()));

		User savedUser = userRepository.save(existingUser);
		return toResponse(savedUser);
	}

	public void delete(Long id) {
		User user = getUserEntityById(id);
		userRepository.delete(user);
	}

	@Transactional(readOnly = true)
	public User getUserEntityById(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User mit ID " + id + " wurde nicht gefunden."));
	}

	private void validateUniqueEmail(String email, Long currentUserId) {
		String normalizedEmail = normalizeEmail(email);

		userRepository.findByEmailIgnoreCase(normalizedEmail).ifPresent(existingUser -> {
			boolean isDifferentUser = currentUserId == null || !existingUser.getId().equals(currentUserId);

			if (isDifferentUser) {
				throw new IllegalArgumentException(
						"Ein Benutzer mit der E-Mail-Adresse '" + normalizedEmail + "' existiert bereits.");
			}
		});
	}

	private String normalizeEmail(String email) {
		return email.trim().toLowerCase(Locale.ROOT);
	}

	private String normalizeLoginIdentifier(String identifier) {
		return identifier.trim().toLowerCase(Locale.ROOT);
	}

	private Set<GlobalRole> copyRoles(Set<GlobalRole> roles) {
		return roles != null ? new HashSet<>(roles) : new HashSet<>();
	}

	private UserResponse toResponse(User user) {
		Long memberId = user.getMember() != null ? user.getMember().getId() : null;

		return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getFullName(),
				user.getUsername(), user.getEmail(), user.isActive(), Set.copyOf(user.getRoles()), memberId);
	}

	/**
	 * Erzeugt aus Vor- und Nachname einen eindeutigen Username.
	 *
	 * Regel: - erste 3 Zeichen des normalisierten Vornamens - plus erste 3 Zeichen
	 * des normalisierten Nachnamens - Umlaute werden sauber umgeschrieben (ä->ae,
	 * ö->oe, ü->ue, ß->ss) - Sonderzeichen, Leerzeichen usw. werden entfernt -
	 * falls der Username bereits existiert, wird eine laufende Zahl angehängt
	 */
	private String generateUniqueUsername(String firstName, String lastName) {
		String firstPart = extractUsernamePart(firstName, 3);
		String lastPart = extractUsernamePart(lastName, 3);

		String baseUsername = (firstPart + lastPart).toLowerCase(Locale.ROOT);

		if (baseUsername.isBlank()) {
			baseUsername = "user";
		}

		String candidate = baseUsername;
		int suffix = 2;

		while (userRepository.existsByUsernameIgnoreCase(candidate)) {
			candidate = baseUsername + suffix;
			suffix++;
		}

		return candidate;
	}

	private String extractUsernamePart(String value, int maxLength) {
		String normalized = normalizeNameForUsername(value);

		if (normalized.isBlank()) {
			return "";
		}

		return normalized.length() <= maxLength ? normalized : normalized.substring(0, maxLength);
	}

	/**
	 * Normalisiert Namensbestandteile für den Username.
	 *
	 * Beispiele: - Müller -> mueller - Jörg -> joerg - Groß -> gross - Émile ->
	 * emile - Anne-Marie -> annemarie
	 */
	private String normalizeNameForUsername(String input) {
		if (input == null) {
			return "";
		}

		String value = input.trim().toLowerCase(Locale.ROOT);

		value = value.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss");

		value = Normalizer.normalize(value, Normalizer.Form.NFD).replaceAll("\\p{M}", "");

		value = value.replaceAll("[^a-z0-9]", "");

		return value;
	}
}