package de.janek.ttc.manager.domain.user;

/**
 * Rollen eines Benutzers innerhalb der Anwendung.
 *
 * PLAYER:
 * Normale Spielerrolle. Kann eigene Verfügbarkeiten pflegen.
 *
 * CAPTAIN:
 * Mannschaftsführer. Kann zusätzlich Team-/Spielplan-relevante Funktionen erhalten.
 *
 * ADMIN:
 * Administrative Rolle für spätere Erweiterungen.
 */
public enum UserRole {
    PLAYER,
    CAPTAIN,
    ADMIN
}