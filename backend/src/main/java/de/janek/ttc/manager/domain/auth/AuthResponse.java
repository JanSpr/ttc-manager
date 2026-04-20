package de.janek.ttc.manager.domain.auth;

import de.janek.ttc.manager.domain.user.UserResponse;

/**
 * Einheitliche Auth-Antwort für Login / aktueller Benutzer / Logout.
 */
public class AuthResponse {

	private boolean authenticated;
	private UserResponse user;

	public AuthResponse() {
	}

	public AuthResponse(boolean authenticated, UserResponse user) {
		this.authenticated = authenticated;
		this.user = user;
	}

	public static AuthResponse authenticated(UserResponse user) {
		return new AuthResponse(true, user);
	}

	public static AuthResponse unauthenticated() {
		return new AuthResponse(false, null);
	}

	public boolean isAuthenticated() {
		return authenticated;
	}

	public UserResponse getUser() {
		return user;
	}

	public void setAuthenticated(boolean authenticated) {
		this.authenticated = authenticated;
	}

	public void setUser(UserResponse user) {
		this.user = user;
	}
}