package de.janek.ttc.manager.domain.member;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST-Controller für Members.
 */
@RestController
@RequestMapping("/api/members")
public class MemberController {

	private final MemberService memberService;

	public MemberController(MemberService memberService) {
		this.memberService = memberService;
	}

	@GetMapping
	public List<MemberResponse> getAllMembers() {
		return memberService.findAll();
	}

	@GetMapping("/available-for-user")
	public List<MemberResponse> getAvailableMembersForUser() {
		return memberService.findAvailableForUser();
	}

	@GetMapping("/{id}")
	public MemberResponse getMemberById(@PathVariable Long id) {
		return memberService.findById(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public MemberResponse createMember(@Valid @RequestBody CreateMemberRequest request) {
		return memberService.create(request);
	}

	@PutMapping("/{id}")
	public MemberResponse updateMember(@PathVariable Long id, @Valid @RequestBody CreateMemberRequest request) {
		return memberService.update(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteMember(@PathVariable Long id) {
		memberService.delete(id);
	}
}