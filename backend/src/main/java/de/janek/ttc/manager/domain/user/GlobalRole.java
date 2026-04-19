package de.janek.ttc.manager.domain.user;

/**
 * Globale Rollen eines Benutzers.
 *
 * Diese Rollen gelten unabhängig von Teams.
 */
public enum GlobalRole {

	/**
	 * Vollzugriff auf die Anwendung.
	 */
	ADMIN,

	/**
	 * Vorstand / organisatorische Rechte.
	 */
	BOARD
}