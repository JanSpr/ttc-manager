package de.janek.ttc.manager.domain.team;

import de.janek.ttc.manager.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

/**
 * Service für die Verwaltung von Teams.
 *
 * Aktueller Stand: - Team verwaltet keine direkten User-Mitglieder mehr -
 * memberCount basiert auf TeamMemberships - TeamMemberships werden
 * standardmäßig nach Aufstellungsposition sortiert
 */
@Service
@Transactional
public class TeamService {

	private final TeamRepository teamRepository;

	public TeamService(TeamRepository teamRepository) {
		this.teamRepository = teamRepository;
	}

	@Transactional(readOnly = true)
	public List<TeamResponse> findAll() {
		return teamRepository.findAll().stream().map(this::toResponse).toList();
	}

	@Transactional(readOnly = true)
	public TeamResponse findById(Long id) {
		return toResponse(getTeamEntityById(id));
	}

	public TeamResponse create(CreateTeamRequest request) {
		validateUniqueTeamName(request.getName(), null);

		Team team = new Team();
		team.setName(request.getName());
		team.setDescription(request.getDescription());
		team.setType(request.getType() != null ? request.getType() : TeamType.ADULT);

		Team savedTeam = teamRepository.save(team);
		return toResponse(savedTeam);
	}

	public TeamResponse update(Long id, CreateTeamRequest request) {
		Team existingTeam = getTeamEntityById(id);

		validateUniqueTeamName(request.getName(), id);

		existingTeam.setName(request.getName());
		existingTeam.setDescription(request.getDescription());
		existingTeam.setType(request.getType() != null ? request.getType() : TeamType.ADULT);

		Team savedTeam = teamRepository.save(existingTeam);
		return toResponse(savedTeam);
	}

	public void delete(Long id) {
		Team team = getTeamEntityById(id);
		teamRepository.delete(team);
	}

	private Team getTeamEntityById(Long id) {
		return teamRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Team mit ID " + id + " wurde nicht gefunden."));
	}

	private void validateUniqueTeamName(String teamName, Long currentTeamId) {
		teamRepository.findByName(teamName).ifPresent(existingTeam -> {
			boolean isDifferentTeam = currentTeamId == null || !existingTeam.getId().equals(currentTeamId);

			if (isDifferentTeam) {
				throw new IllegalArgumentException("Ein Team mit dem Namen '" + teamName + "' existiert bereits.");
			}
		});
	}

	private TeamResponse toResponse(Team team) {
		List<TeamMembershipSummaryResponse> memberships = team.getMemberships().stream()
				.sorted(teamMembershipComparator())
				.map(membership -> new TeamMembershipSummaryResponse(membership.getId(), membership.getMember().getId(),
						membership.getMember().getFullName(),
						membership.getMember().getUser() != null ? membership.getMember().getUser().getId() : null,
						membership.getLineupPosition(), membership.isPlayer(), membership.isCaptain(),
						membership.isViceCaptain()))
				.toList();

		return new TeamResponse(team.getId(), team.getName(), team.getDescription(), team.getType(), memberships.size(),
				memberships);
	}

	private Comparator<TeamMembership> teamMembershipComparator() {
		return Comparator.comparing(TeamMembership::getLineupPosition, Comparator.nullsLast(Integer::compareTo))
				.thenComparing(membership -> membership.getMember().getLastName(), String.CASE_INSENSITIVE_ORDER)
				.thenComparing(membership -> membership.getMember().getFirstName(), String.CASE_INSENSITIVE_ORDER);
	}
}