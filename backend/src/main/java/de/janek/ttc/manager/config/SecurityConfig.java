package de.janek.ttc.manager.config;

import de.janek.ttc.manager.domain.auth.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Zentrale Spring-Security-Konfiguration.
 *
 * Aktueller Ansatz: - session-basierte Authentifizierung - eigene
 * REST-Endpunkte für Login/Logout - öffentliche Read-Endpunkte für den
 * aktuellen MVP - eingeschränkte Write-Endpunkte für administrative Änderungen
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	private final CustomUserDetailsService customUserDetailsService;

	@Value("${app.frontend.base-url:http://localhost:5173}")
	private String frontendBaseUrl;

	public SecurityConfig(CustomUserDetailsService customUserDetailsService) {
		this.customUserDetailsService = customUserDetailsService;
	}

	/**
	 * PasswordEncoder für sicheres Hashing von Passwörtern.
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	/**
	 * AuthenticationProvider auf Basis unseres CustomUserDetailsService.
	 */
	@Bean
	public DaoAuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);
		provider.setPasswordEncoder(passwordEncoder);
		return provider;
	}

	/**
	 * AuthenticationManager von Spring.
	 */
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	/**
	 * Hauptkonfiguration der HTTP-Security.
	 */
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(Customizer.withDefaults()).csrf(AbstractHttpConfigurer::disable)
				.httpBasic(AbstractHttpConfigurer::disable).formLogin(AbstractHttpConfigurer::disable)
				.logout(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
				.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

						/*
						 * Öffentliche Auth-Endpunkte.
						 */
						.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/auth/logout").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/auth/me").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/test").permitAll()

						/*
						 * Öffentliche Registrierung bleibt vorerst offen.
						 */
						.requestMatchers(HttpMethod.POST, "/api/users").permitAll()

						/*
						 * Self-Service für eingeloggte Benutzer.
						 */
						.requestMatchers(HttpMethod.GET, "/api/users/me").authenticated()
						.requestMatchers(HttpMethod.PUT, "/api/users/me").authenticated()

						/*
						 * Benutzerverwaltung außerhalb des Self-Service ist administrativ.
						 */
						.requestMatchers(HttpMethod.GET, "/api/users").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.DELETE, "/api/users/**").hasAnyRole("ADMIN", "BOARD")

						/*
						 * Öffentliche Read-Endpunkte für den aktuellen MVP.
						 */
						.requestMatchers(HttpMethod.GET, "/api/teams").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/teams/*").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/teams/*/memberships").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/members").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/members/**").permitAll()

						/*
						 * Administrative Write-Zugriffe für Members.
						 */
						.requestMatchers(HttpMethod.POST, "/api/members").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.PUT, "/api/members/**").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.DELETE, "/api/members/**").hasAnyRole("ADMIN", "BOARD")

						/*
						 * Administrative Write-Zugriffe für Teams.
						 */
						.requestMatchers(HttpMethod.POST, "/api/teams").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.PUT, "/api/teams/*").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.DELETE, "/api/teams/*").hasAnyRole("ADMIN", "BOARD")

						/*
						 * TeamMembership-Änderungen sind ebenfalls administrativ.
						 */
						.requestMatchers(HttpMethod.POST, "/api/teams/*/memberships").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.PUT, "/api/teams/*/memberships/*").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.DELETE, "/api/teams/*/memberships/*").hasAnyRole("ADMIN", "BOARD")

						/*
						 * Alles andere benötigt Authentifizierung.
						 */
						.anyRequest().authenticated());

		return http.build();
	}

	/**
	 * Globale CORS-Konfiguration für das React-Frontend.
	 */
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of(frontendBaseUrl));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("Content-Type", "Accept", "X-Requested-With", "Origin"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}