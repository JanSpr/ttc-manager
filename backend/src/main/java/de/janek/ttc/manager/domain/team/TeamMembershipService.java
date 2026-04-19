package de.janek.ttc.manager.domain.team;

import de.janek.ttc.manager.common.exception.ResourceNotFoundException;
import de.janek.ttc.manager.domain.member.Member;
import de.janek.ttc.manager.domain.member.MemberService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

		return teamMembershipRepository.findAllByTeamId(teamId).stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public List<TeamMembershipResponse> findAllByMemberId(Long memberId) {
		memberService.getMemberEntityById(memberId);

		return teamMembershipRepository.findAllByMemberId(memberId).stream().map(this::toResponse).toList();
	}

	public TeamMembershipResponse create(Long teamId, CreateTeamMembershipRequest request) {
		Team team = getTeamEntityById(teamId);
		Member member = memberService.getMemberEntityById(request.getMemberId());

		if (teamMembershipRepository.existsByTeamIdAndMemberId(teamId, request.getMemberId())) {
			throw new IllegalArgumentException("Für Member mit ID " + request.getMemberId()
					+ " existiert bereits eine Membership in Team mit ID " + teamId + ".");
		}

		TeamMembership membership = new TeamMembership();
		membership.setTeam(team);
		membership.setMember(member);
		membership.setPlayer(request.getPlayer());
		membership.setCaptain(request.getCaptain());
		membership.setViceCaptain(request.getViceCaptain());

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

		existingMembership.setMember(member);
		existingMembership.setPlayer(request.getPlayer());
		existingMembership.setCaptain(request.getCaptain());
		existingMembership.setViceCaptain(request.getViceCaptain());

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
				membership.isPlayer(), membership.isCaptain(), membership.isViceCaptain());
	}
}