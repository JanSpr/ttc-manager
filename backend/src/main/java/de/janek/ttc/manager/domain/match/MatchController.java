package de.janek.ttc.manager.domain.match;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST-Controller für Spiele.
 */
@RestController
@RequestMapping("/api/matches")
public class MatchController {

	private final MatchService matchService;

	public MatchController(MatchService matchService) {
		this.matchService = matchService;
	}

	@GetMapping
	public List<MatchResponse> getAllMatches() {
		return matchService.findAll();
	}

	@GetMapping("/{id}")
	public MatchResponse getMatchById(@PathVariable Long id) {
		return matchService.findById(id);
	}

	// 🔹 NEU
	@GetMapping("/upcoming")
	public List<MatchResponse> getUpcomingMatches() {
		return matchService.findUpcoming();
	}

	// 🔹 NEU
	@GetMapping("/upcoming/team/{teamId}")
	public List<MatchResponse> getUpcomingMatchesByTeam(@PathVariable Long teamId) {
		return matchService.findUpcomingByTeam(teamId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public MatchResponse createMatch(@Valid @RequestBody CreateMatchRequest request) {
		return matchService.create(request);
	}

	@PutMapping("/{id}")
	public MatchResponse updateMatch(@PathVariable Long id, @Valid @RequestBody CreateMatchRequest request) {
		return matchService.update(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteMatch(@PathVariable Long id) {
		matchService.delete(id);
	}
}