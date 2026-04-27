package de.janek.ttc.manager.domain.auth;

import de.janek.ttc.manager.domain.user.User;
import de.janek.ttc.manager.domain.user.UserRepository;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

/**
 * Spring-Security-Anbindung für unsere User-Entität.
 *
 * Login erfolgt über: - E-Mail-Adresse - oder Username
 *
 * Ein vorbereiteter Account ohne Passwort kann sich nicht einloggen. Das Feld
 * active wird aktuell nicht als Aktivierungsstatus verwendet.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
		String normalizedIdentifier = identifier.trim().toLowerCase(Locale.ROOT);

		User user = userRepository.findByEmailIgnoreCaseOrUsernameIgnoreCase(normalizedIdentifier, normalizedIdentifier)
				.orElseThrow(() -> new UsernameNotFoundException(
						"Benutzer mit Login '" + identifier + "' wurde nicht gefunden."));

		if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
			throw new DisabledException("Das Benutzerkonto wurde noch nicht aktiviert.");
		}

		List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
				.map(role -> new SimpleGrantedAuthority("ROLE_" + role.name())).toList();

		return org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
				.password(user.getPasswordHash()).authorities(authorities).disabled(false).build();
	}
}