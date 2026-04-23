package de.janek.ttc.manager.domain.team;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository für TeamMemberships.
 */
public interface TeamMembershipRepository extends JpaRepository<TeamMembership, Long> {

	List<TeamMembership> findAllByTeamId(Long teamId);

	List<TeamMembership> findAllByMemberId(Long memberId);

	Optional<TeamMembership> findByTeamIdAndMemberId(Long teamId, Long memberId);

	boolean existsByTeamIdAndMemberId(Long teamId, Long memberId);

	// 🔥 NEU
	boolean existsByTeamIdAndCaptainTrue(Long teamId);

	// 🔥 NEU (für Update-Fall)
	boolean existsByTeamIdAndCaptainTrueAndIdNot(Long teamId, Long membershipId);
}