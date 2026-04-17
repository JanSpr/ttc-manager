package de.janek.ttc.manager.domain.match;

import de.janek.ttc.manager.domain.team.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository für Spiele.
 */
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findAllByTeamOrderByMatchDateTimeAsc(Team team);

    List<Match> findAllByTeamIdOrderByMatchDateTimeAsc(Long teamId);

    List<Match> findAllByMatchDateTimeAfterOrderByMatchDateTimeAsc(LocalDateTime from);

    List<Match> findAllByTeamIdAndMatchDateTimeAfterOrderByMatchDateTimeAsc(Long teamId, LocalDateTime from);

    List<Match> findAllByStatusOrderByMatchDateTimeAsc(MatchStatus status);
}