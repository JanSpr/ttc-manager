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
 * Central Spring Security configuration.
 *
 * Current approach: - session-based authentication - custom REST login/logout
 * endpoints - public read endpoints for current MVP - restricted write
 * endpoints for administrative data changes
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
	 * Password encoder for secure password hashing.
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	/**
	 * Authentication provider based on our custom user details service.
	 */
	@Bean
	public DaoAuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);
		provider.setPasswordEncoder(passwordEncoder);
		return provider;
	}

	/**
	 * Authentication manager provided by Spring.
	 */
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	/**
	 * Main HTTP security configuration.
	 */
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(Customizer.withDefaults()).csrf(AbstractHttpConfigurer::disable)
				.httpBasic(AbstractHttpConfigurer::disable).formLogin(AbstractHttpConfigurer::disable)
				.logout(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
				.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

						/*
						 * Public authentication endpoints.
						 */
						.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/auth/logout").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/auth/me").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/test").permitAll()

						/*
						 * User registration stays open for now, matching your current project state.
						 */
						.requestMatchers(HttpMethod.POST, "/api/users").permitAll()

						/*
						 * Public read endpoints for the current MVP.
						 */
						.requestMatchers(HttpMethod.GET, "/api/teams").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/teams/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/members").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/members/**").permitAll()

						/*
						 * Administrative write access for members.
						 */
						.requestMatchers(HttpMethod.POST, "/api/members").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.PUT, "/api/members/**").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.DELETE, "/api/members/**").hasAnyRole("ADMIN", "BOARD")

						/*
						 * Administrative write access for teams.
						 */
						.requestMatchers(HttpMethod.POST, "/api/teams").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.PUT, "/api/teams/**").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.DELETE, "/api/teams/**").hasAnyRole("ADMIN", "BOARD")

						/*
						 * Team membership changes should also be administrative.
						 */
						.requestMatchers(HttpMethod.POST, "/api/team-memberships").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.PUT, "/api/team-memberships/**").hasAnyRole("ADMIN", "BOARD")
						.requestMatchers(HttpMethod.DELETE, "/api/team-memberships/**").hasAnyRole("ADMIN", "BOARD")

						/*
						 * Everything else requires authentication.
						 */
						.anyRequest().authenticated());

		return http.build();
	}

	/**
	 * Global CORS configuration for the React frontend.
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