package de.janek.ttc.manager.domain.team;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST-Controller für TeamMemberships.
 */
@RestController
@RequestMapping("/api/teams/{teamId}/memberships")
public class TeamMembershipController {

	private final TeamMembershipService teamMembershipService;

	public TeamMembershipController(TeamMembershipService teamMembershipService) {
		this.teamMembershipService = teamMembershipService;
	}

	@GetMapping
	public List<TeamMembershipResponse> getMembershipsByTeam(@PathVariable Long teamId) {
		return teamMembershipService.findAllByTeamId(teamId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public TeamMembershipResponse createMembership(@PathVariable Long teamId,
			@Valid @RequestBody CreateTeamMembershipRequest request) {
		return teamMembershipService.create(teamId, request);
	}

	@PutMapping("/{membershipId}")
	public TeamMembershipResponse updateMembership(@PathVariable Long teamId, @PathVariable Long membershipId,
			@Valid @RequestBody CreateTeamMembershipRequest request) {
		return teamMembershipService.update(teamId, membershipId, request);
	}

	@DeleteMapping("/{membershipId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteMembership(@PathVariable Long teamId, @PathVariable Long membershipId) {
		teamMembershipService.delete(teamId, membershipId);
	}
}