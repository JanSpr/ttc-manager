package de.janek.ttc.manager.domain.user;

import de.janek.ttc.manager.domain.member.Member;
import de.janek.ttc.manager.domain.member.MemberRepository;
import de.janek.ttc.manager.exception.ResourceNotFoundException;

import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
@Transactional
public class UserService {

	private final UserRepository userRepository;
	private final MemberRepository memberRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, MemberRepository memberRepository,
			PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.memberRepository = memberRepository;
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

	public UserResponse create(CreateUserRequest request) {
		validateUniqueEmail(request.getEmail(), null);

		// 🔹 Member holen
		Member member = resolveMember(request.getMemberId());

		// 🔹 sicherstellen: Member hat noch keinen User
		validateMemberWithoutUser(member, null);

		String normalizedFirstName = request.getFirstName().trim();
		String normalizedLastName = request.getLastName().trim();
		String normalizedEmail = normalizeEmail(request.getEmail());
		String generatedUsername = generateUniqueUsername(normalizedFirstName, normalizedLastName);

		User user = new User();
		user.setFirstName(normalizedFirstName);
		user.setLastName(normalizedLastName);
		user.setUsername(generatedUsername);
		user.setEmail(normalizedEmail);
		user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
		user.setActive(request.getActive());
		user.setRoles(copyRoles(request.getRoles()));

		User savedUser = userRepository.save(user);

		// 🔹 VERKNÜPFUNG SETZEN (wichtig!)
		member.setUser(savedUser);
		savedUser.setMember(member);

		return toResponse(savedUser);
	}

	public UserResponse update(Long id, UpdateUserRequest request) {
		User existingUser = getUserEntityById(id);

		validateUniqueEmail(request.getEmail(), id);

		Member newMember = resolveMember(request.getMemberId());

		// 🔹 prüfen ob Member schon vergeben
		validateMemberWithoutUser(newMember, id);

		existingUser.setFirstName(request.getFirstName().trim());
		existingUser.setLastName(request.getLastName().trim());
		existingUser.setEmail(normalizeEmail(request.getEmail()));
		existingUser.setActive(request.getActive());
		existingUser.setRoles(copyRoles(request.getRoles()));

		if (hasText(request.getPassword())) {
			existingUser.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
		}

		// 🔹 alte Verknüpfung lösen
		Member oldMember = existingUser.getMember();
		if (oldMember != null && !oldMember.equals(newMember)) {
			oldMember.setUser(null);
		}

		// 🔹 neue setzen
		newMember.setUser(existingUser);
		existingUser.setMember(newMember);

		User savedUser = userRepository.save(existingUser);
		return toResponse(savedUser);
	}

	public void delete(Long id) {
		User user = getUserEntityById(id);

		if (user.getMember() != null) {
			Member member = user.getMember();
			member.setUser(null);
			user.setMember(null);
		}

		userRepository.delete(user);
	}

	@Transactional(readOnly = true)
	public User getUserEntityById(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User mit ID " + id + " wurde nicht gefunden."));
	}

	private Member resolveMember(Long memberId) {
		return memberRepository.findById(memberId).orElseThrow(
				() -> new ResourceNotFoundException("Member mit ID " + memberId + " wurde nicht gefunden."));
	}

	private void validateMemberWithoutUser(Member member, Long currentUserId) {
		if (member.getUser() == null) {
			return;
		}

		boolean isSameUser = currentUserId != null && member.getUser().getId().equals(currentUserId);

		if (!isSameUser) {
			throw new IllegalArgumentException(
					"Das Mitglied '" + member.getFullName() + "' ist bereits mit einem Benutzerkonto verknüpft.");
		}
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

	private Set<GlobalRole> copyRoles(Set<GlobalRole> roles) {
		return roles != null ? new HashSet<>(roles) : new HashSet<>();
	}

	private boolean hasText(String value) {
		return value != null && !value.trim().isEmpty();
	}

	private UserResponse toResponse(User user) {
		Long memberId = user.getMember() != null ? user.getMember().getId() : null;
		String memberFullName = user.getMember() != null ? user.getMember().getFullName() : null;

		return new UserResponse(user.getId(), user.getFirstName(), user.getLastName(), user.getFullName(),
				user.getUsername(), user.getEmail(), user.isActive(), Set.copyOf(user.getRoles()), memberId,
				memberFullName);
	}

	// --- Username Logik bleibt unverändert ---

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