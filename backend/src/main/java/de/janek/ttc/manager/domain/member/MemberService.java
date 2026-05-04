package de.janek.ttc.manager.domain.member;

import de.janek.ttc.manager.domain.team.TeamMembership;
import de.janek.ttc.manager.domain.user.User;
import de.janek.ttc.manager.domain.user.UserRepository;
import de.janek.ttc.manager.exception.ResourceNotFoundException;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service für Members.
 */
@Service
@Transactional
public class MemberService {

	private final MemberRepository memberRepository;
	private final UserRepository userRepository;

	public MemberService(MemberRepository memberRepository, UserRepository userRepository) {
		this.memberRepository = memberRepository;
		this.userRepository = userRepository;
	}

	@Transactional(readOnly = true)
	public List<MemberResponse> findAll() {
		return memberRepository.findAll(Sort.by("id")).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public MemberResponse findById(Long id) {
		return toResponse(getMemberEntityById(id));
	}

	@Transactional(readOnly = true)
	public List<MemberResponse> findAvailableForUser() {
		return memberRepository.findByUserIsNull().stream().map(this::toResponse).toList();
	}

	public MemberResponse create(CreateMemberRequest request) {
		validateCreateUserAccountRequest(request);
		validateUniqueUserAssignment(request.getUserId(), null);

		Member member = new Member();
		member.setFirstName(request.getFirstName().trim());
		member.setLastName(request.getLastName().trim());
		member.setActive(request.getActive());
		member.setType(request.getType());

		if (request.getUserId() != null) {
			member.setUser(resolveUser(request.getUserId()));
		}

		Member savedMember = memberRepository.save(member);

		if (shouldCreateUserAccount(request)) {
			User preparedUser = createPreparedUserForMember(savedMember);
			savedMember.setUser(preparedUser);
			savedMember = memberRepository.save(savedMember);
		}

		return toResponse(savedMember);
	}

	public MemberResponse update(Long id, CreateMemberRequest request) {
		Member existingMember = getMemberEntityById(id);

		validateCreateUserAccountRequest(request);
		validateUniqueUserAssignment(request.getUserId(), id);

		existingMember.setFirstName(request.getFirstName().trim());
		existingMember.setLastName(request.getLastName().trim());
		existingMember.setActive(request.getActive());
		existingMember.setType(request.getType());

		if (request.getUserId() != null) {
			existingMember.setUser(resolveUser(request.getUserId()));
		} else if (!shouldCreateUserAccount(request)) {
			existingMember.setUser(null);
		}

		if (shouldCreateUserAccount(request) && existingMember.getUser() == null) {
			User preparedUser = createPreparedUserForMember(existingMember);
			existingMember.setUser(preparedUser);
		}

		Member savedMember = memberRepository.save(existingMember);
		return toResponse(savedMember);
	}

	public void delete(Long id) {
		Member member = getMemberEntityById(id);
		User user = member.getUser();

		// 🔥 WICHTIG: Beziehung sauber lösen
		if (user != null) {
			member.setUser(null);
			user.setMember(null);
			userRepository.delete(user);
		}

		memberRepository.delete(member);
	}

	@Transactional(readOnly = true)
	public Member getMemberEntityById(Long id) {
		return memberRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Member mit ID " + id + " wurde nicht gefunden."));
	}

	private void validateCreateUserAccountRequest(CreateMemberRequest request) {
		if (request.getUserId() != null && shouldCreateUserAccount(request)) {
			throw new IllegalArgumentException(
					"Ein Member kann nicht gleichzeitig mit einem bestehenden User verknüpft werden und ein neues Benutzerkonto vorbereiten.");
		}
	}

	private boolean shouldCreateUserAccount(CreateMemberRequest request) {
		return Boolean.TRUE.equals(request.getCreateUserAccount());
	}

	private User resolveUser(Long userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User mit ID " + userId + " wurde nicht gefunden."));
	}

	private User createPreparedUserForMember(Member member) {
		User user = new User();
		user.setFirstName(member.getFirstName());
		user.setLastName(member.getLastName());
		user.setUsername(generateUniqueUsername(member.getFirstName(), member.getLastName()));
		user.setEmail(null);
		user.setPasswordHash(null);
		user.setActivationCode(generateActivationCode());
		user.setActive(false);

		return userRepository.save(user);
	}

	private String generateActivationCode() {
		String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
		StringBuilder code = new StringBuilder();

		for (int i = 0; i < 8; i++) {
			int index = (int) (Math.random() * chars.length());
			code.append(chars.charAt(index));

			if (i == 3) {
				code.append("-");
			}
		}

		return code.toString();
	}

	private void validateUniqueUserAssignment(Long userId, Long currentMemberId) {
		if (userId == null) {
			return;
		}

		memberRepository.findByUserId(userId).ifPresent(existingMember -> {
			boolean isDifferentMember = currentMemberId == null || !existingMember.getId().equals(currentMemberId);

			if (isDifferentMember) {
				throw new IllegalArgumentException(
						"Der User mit ID " + userId + " ist bereits einem anderen Member zugeordnet.");
			}
		});
	}

	private MemberResponse toResponse(Member member) {
		User user = member.getUser();
		Long userId = user != null ? user.getId() : null;
		boolean accountActivated = user != null && user.getPasswordHash() != null && !user.getPasswordHash().isBlank();

		Set<Long> teamIds = member.getMemberships().stream().map(TeamMembership::getTeam).map(team -> team.getId())
				.collect(Collectors.toSet());

		return new MemberResponse(member.getId(), member.getFirstName(), member.getLastName(), member.getFullName(),
				member.isActive(), member.getType(), userId, accountActivated, teamIds);
	}

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