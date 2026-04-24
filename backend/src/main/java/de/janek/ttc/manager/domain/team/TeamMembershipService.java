package de.janek.ttc.manager.domain.team;

import de.janek.ttc.manager.domain.member.Member;
import de.janek.ttc.manager.domain.member.MemberService;
import de.janek.ttc.manager.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

/**
 * Service für TeamMemberships.
 */
@Service
@Transactional
public class TeamMembershipService {

	private final TeamMembershipRepository teamMembershipRepository;
	private final TeamRepository teamRepository;
	private final MemberService memberService;

	public TeamMembershipService(TeamMembershipRepository teamMembershipRepository, TeamRepository teamRepository,
			MemberService memberService) {
		this.teamMembershipRepository = teamMembershipRepository;
		this.teamRepository = teamRepository;
		this.memberService = memberService;
	}

	@Transactional(readOnly = true)
	public List<TeamMembershipResponse> findAllByTeamId(Long teamId) {
		getTeamEntityById(teamId);

		return teamMembershipRepository.findAllByTeamId(teamId).stream().sorted(teamMembershipComparator())
				.map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<TeamMembershipResponse> findAllByMemberId(Long memberId) {
		memberService.getMemberEntityById(memberId);

		return teamMembershipRepository.findAllByMemberId(memberId).stream()
				.sorted(Comparator.comparing((TeamMembership membership) -> membership.getTeam().getName(),
						String.CASE_INSENSITIVE_ORDER).thenComparing(teamMembershipComparator()))
				.map(this::toResponse).toList();
	}

	public TeamMembershipResponse create(Long teamId, CreateTeamMembershipRequest request) {
		Team team = getTeamEntityById(teamId);
		Member member = memberService.getMemberEntityById(request.getMemberId());

		if (teamMembershipRepository.existsByTeamIdAndMemberId(teamId, request.getMemberId())) {
			throw new IllegalArgumentException("Für Member mit ID " + request.getMemberId()
					+ " existiert bereits eine Membership in Team mit ID " + teamId + ".");
		}

		if (Boolean.TRUE.equals(request.getCaptain())
				&& teamMembershipRepository.existsByTeamIdAndCaptainTrue(teamId)) {
			throw new IllegalArgumentException(
					"Dieses Team hat bereits einen Mannschaftsführer. Bitte entferne diesen zuerst.");
		}

		boolean isPlayer = Boolean.TRUE.equals(request.getPlayer());

		TeamMembership membership = new TeamMembership();
		membership.setTeam(team);
		membership.setMember(member);
		membership.setPlayer(isPlayer);
		membership.setCaptain(Boolean.TRUE.equals(request.getCaptain()));
		membership.setViceCaptain(Boolean.TRUE.equals(request.getViceCaptain()));
		membership.setLineupPosition(resolveLineupPosition(isPlayer, request.getLineupPosition()));

		TeamMembership savedMembership = teamMembershipRepository.save(membership);
		return toResponse(savedMembership);
	}

	public TeamMembershipResponse update(Long teamId, Long membershipId, CreateTeamMembershipRequest request) {
		TeamMembership existingMembership = getMembershipEntityById(membershipId);

		if (!existingMembership.getTeam().getId().equals(teamId)) {
			throw new IllegalArgumentException(
					"Die Membership mit ID " + membershipId + " gehört nicht zum Team mit ID " + teamId + ".");
		}

		Member member = memberService.getMemberEntityById(request.getMemberId());

		boolean memberChanged = !existingMembership.getMember().getId().equals(request.getMemberId());
		if (memberChanged && teamMembershipRepository.existsByTeamIdAndMemberId(teamId, request.getMemberId())) {
			throw new IllegalArgumentException("Für Member mit ID " + request.getMemberId()
					+ " existiert bereits eine Membership in Team mit ID " + teamId + ".");
		}

		if (Boolean.TRUE.equals(request.getCaptain())
				&& teamMembershipRepository.existsByTeamIdAndCaptainTrueAndIdNot(teamId, membershipId)) {
			throw new IllegalArgumentException(
					"Dieses Team hat bereits einen Mannschaftsführer. Bitte entferne diesen zuerst.");
		}

		boolean isPlayer = Boolean.TRUE.equals(request.getPlayer());

		existingMembership.setMember(member);
		existingMembership.setPlayer(isPlayer);
		existingMembership.setCaptain(Boolean.TRUE.equals(request.getCaptain()));
		existingMembership.setViceCaptain(Boolean.TRUE.equals(request.getViceCaptain()));
		existingMembership.setLineupPosition(resolveLineupPosition(isPlayer, request.getLineupPosition()));

		TeamMembership savedMembership = teamMembershipRepository.save(existingMembership);
		return toResponse(savedMembership);
	}

	public void delete(Long teamId, Long membershipId) {
		TeamMembership membership = getMembershipEntityById(membershipId);

		if (!membership.getTeam().getId().equals(teamId)) {
			throw new IllegalArgumentException(
					"Die Membership mit ID " + membershipId + " gehört nicht zum Team mit ID " + teamId + ".");
		}

		teamMembershipRepository.delete(membership);
	}

	private Integer resolveLineupPosition(boolean isPlayer, Integer requestedLineupPosition) {
		if (!isPlayer) {
			return null;
		}

		return requestedLineupPosition;
	}

	private Team getTeamEntityById(Long id) {
		return teamRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Team mit ID " + id + " wurde nicht gefunden."));
	}

	private TeamMembership getMembershipEntityById(Long id) {
		return teamMembershipRepository.findById(id).orElseThrow(
				() -> new ResourceNotFoundException("TeamMembership mit ID " + id + " wurde nicht gefunden."));
	}

	private TeamMembershipResponse toResponse(TeamMembership membership) {
		return new TeamMembershipResponse(membership.getId(), membership.getTeam().getId(),
				membership.getTeam().getName(), membership.getMember().getId(), membership.getMember().getFullName(),
				membership.getLineupPosition(), membership.isPlayer(), membership.isCaptain(),
				membership.isViceCaptain());
	}

	private Comparator<TeamMembership> teamMembershipComparator() {
		return Comparator.comparing(TeamMembership::getLineupPosition, Comparator.nullsLast(Integer::compareTo))
				.thenComparing(membership -> membership.getMember().getLastName(), String.CASE_INSENSITIVE_ORDER)
				.thenComparing(membership -> membership.getMember().getFirstName(), String.CASE_INSENSITIVE_ORDER);
	}
}