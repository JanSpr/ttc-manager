package de.janek.ttc.manager.domain.auth;

import de.janek.ttc.manager.domain.user.User;
import de.janek.ttc.manager.domain.user.UserRepository;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Spring-Security-Anbindung für unsere User-Entität.
 *
 * Login erfolgt über die E-Mail-Adresse.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(
				() -> new UsernameNotFoundException("Benutzer mit E-Mail '" + email + "' wurde nicht gefunden."));

		if (!user.isActive()) {
			throw new DisabledException("Das Benutzerkonto ist deaktiviert.");
		}

		List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
				.map(role -> new SimpleGrantedAuthority("ROLE_" + role.name())).toList();

		return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
				.password(user.getPasswordHash()).authorities(authorities).disabled(!user.isActive()).build();
	}
}