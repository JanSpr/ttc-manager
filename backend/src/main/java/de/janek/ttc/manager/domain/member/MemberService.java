package de.janek.ttc.manager.domain.member;

import de.janek.ttc.manager.domain.team.TeamMembership;
import de.janek.ttc.manager.domain.user.User;
import de.janek.ttc.manager.domain.user.UserRepository;
import de.janek.ttc.manager.exception.ResourceNotFoundException;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

	public MemberResponse create(CreateMemberRequest request) {
		validateUniqueUserAssignment(request.getUserId(), null);

		Member member = new Member();
		member.setFirstName(request.getFirstName());
		member.setLastName(request.getLastName());
		member.setActive(request.getActive());
		member.setUser(resolveUser(request.getUserId()));

		Member savedMember = memberRepository.save(member);
		return toResponse(savedMember);
	}

	public MemberResponse update(Long id, CreateMemberRequest request) {
		Member existingMember = getMemberEntityById(id);

		validateUniqueUserAssignment(request.getUserId(), id);

		existingMember.setFirstName(request.getFirstName());
		existingMember.setLastName(request.getLastName());
		existingMember.setActive(request.getActive());
		existingMember.setUser(resolveUser(request.getUserId()));

		Member savedMember = memberRepository.save(existingMember);
		return toResponse(savedMember);
	}

	public void delete(Long id) {
		Member member = getMemberEntityById(id);
		memberRepository.delete(member);
	}

	@Transactional(readOnly = true)
	public Member getMemberEntityById(Long id) {
		return memberRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Member mit ID " + id + " wurde nicht gefunden."));
	}

	private User resolveUser(Long userId) {
		if (userId == null) {
			return null;
		}

		return userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User mit ID " + userId + " wurde nicht gefunden."));
	}

	/**
	 * Stellt sicher, dass ein User nicht mehreren Members zugeordnet wird.
	 *
	 * @param userId          gewünschte User-ID; null erlaubt
	 * @param currentMemberId ID des aktuell bearbeiteten Members; bei Neuanlage
	 *                        null
	 */
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
		Long userId = member.getUser() != null ? member.getUser().getId() : null;

		Set<Long> teamIds = member.getMemberships().stream().map(TeamMembership::getTeam).map(team -> team.getId())
				.collect(Collectors.toSet());

		return new MemberResponse(member.getId(), member.getFirstName(), member.getLastName(), member.getFullName(),
				member.isActive(), userId, teamIds);
	}
}