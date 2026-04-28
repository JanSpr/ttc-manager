package de.janek.ttc.manager.domain.auth;

import de.janek.ttc.manager.domain.user.ActivateUserAccountRequest;
import de.janek.ttc.manager.domain.user.UserResponse;
import de.janek.ttc.manager.domain.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST-Endpunkte für Login, Logout, Aktivierung und aktuellen Benutzer.
 *
 * Session-basierter Ablauf: - POST /api/auth/login authentifiziert Benutzer und
 * speichert den SecurityContext in der Session - GET
 * /api/auth/activation-preview liefert Vorschau-Daten zu einem Aktivierungscode
 * - POST /api/auth/activate aktiviert ein vorbereitetes Benutzerkonto - GET
 * /api/auth/me liefert den aktuell eingeloggten Benutzer - POST
 * /api/auth/logout beendet die Session
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final UserService userService;
	private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();

	public AuthController(AuthenticationManager authenticationManager, UserService userService) {
		this.authenticationManager = authenticationManager;
		this.userService = userService;
	}

	@PostMapping("/login")
	public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest,
			HttpServletResponse httpResponse) {
		try {
			UsernamePasswordAuthenticationToken authenticationToken = UsernamePasswordAuthenticationToken
					.unauthenticated(request.getIdentifier().trim(), request.getPassword());

			Authentication authentication = authenticationManager.authenticate(authenticationToken);

			SecurityContext context = SecurityContextHolder.createEmptyContext();
			context.setAuthentication(authentication);
			SecurityContextHolder.setContext(context);

			securityContextRepository.saveContext(context, httpRequest, httpResponse);

			UserResponse user = userService.findByLoginIdentifier(authentication.getName());
			return AuthResponse.authenticated(user);
		} catch (BadCredentialsException ex) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-Mail/Username oder Passwort ist falsch.");
		}
	}

	@GetMapping("/activation-preview")
	public ActivationPreviewResponse activationPreview(@RequestParam String activationCode) {
		return userService.getActivationPreview(activationCode);
	}

	@PostMapping("/activate")
	public UserResponse activate(@Valid @RequestBody ActivateUserAccountRequest request) {
		return userService.activatePreparedAccount(request);
	}

	@GetMapping("/me")
	public AuthResponse me(Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated()
				|| authentication instanceof AnonymousAuthenticationToken) {
			return AuthResponse.unauthenticated();
		}

		UserResponse user = userService.findByLoginIdentifier(authentication.getName());
		return AuthResponse.authenticated(user);
	}

	@PostMapping("/logout")
	@ResponseStatus(HttpStatus.OK)
	public AuthResponse logout(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) {
		if (authentication != null && !(authentication instanceof AnonymousAuthenticationToken)) {
			new SecurityContextLogoutHandler().logout(request, response, authentication);
		}

		return AuthResponse.unauthenticated();
	}
}