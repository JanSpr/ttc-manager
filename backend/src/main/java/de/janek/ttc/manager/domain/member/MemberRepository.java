package de.janek.ttc.manager.domain.member;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository für Members.
 */
public interface MemberRepository extends JpaRepository<Member, Long> {

	List<Member> findAllByActiveTrue();

	Optional<Member> findByUserId(Long userId);

	boolean existsByUserId(Long userId);

	List<Member> findByUserIsNull();
}