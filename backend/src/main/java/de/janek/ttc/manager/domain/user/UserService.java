package de.janek.ttc.manager.domain.user;

import de.janek.ttc.manager.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service für Benutzerverwaltung.
 *
 * Aktueller Zwischenstand: - verwaltet User / Login-Konten - keine direkte
 * Team-Zuordnung - globale Rollen statt alter Einzelrolle - Passwort wird beim
 * Speichern sicher gehasht
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
		User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(
				() -> new ResourceNotFoundException("User mit E-Mail '" + email + "' wurde nicht gefunden."));

		return toResponse(user);
	}

	public UserResponse create(CreateUserRequest request) {
		validateUniqueEmail(request.getEmail(), null);

		User user = new User();
		user.setFirstName(request.getFirstName().trim());
		user.setLastName(request.getLastName().trim());
		user.setEmail(normalizeEmail(request.getEmail()));
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
		return email.trim().toLowerCase();
	}

	private Set<GlobalRole> copyRoles(Set<GlobalRole> roles) {
		return roles != null ? new HashSet<>(roles) : new HashSet<>();
	}

	private UserResponse toResponse(User user) {
		Long memberId = user.getMember() != null ? user.getMember().getId() : null;

		return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getFullName(),
				user.getEmail(), user.isActive(), Set.copyOf(user.getRoles()), memberId);
	}
}