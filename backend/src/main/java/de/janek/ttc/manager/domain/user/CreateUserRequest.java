package de.janek.ttc.manager.domain.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Request-DTO zum Erstellen oder Aktualisieren eines Benutzers.
 */
public class CreateUserRequest {

    @NotBlank(message = "Der Vorname darf nicht leer sein.")
    @Size(max = 100, message = "Der Vorname darf maximal 100 Zeichen lang sein.")
    private String firstName;

    @NotBlank(message = "Der Nachname darf nicht leer sein.")
    @Size(max = 100, message = "Der Nachname darf maximal 100 Zeichen lang sein.")
    private String lastName;

    @NotBlank(message = "Die E-Mail-Adresse darf nicht leer sein.")
    @Email(message = "Die E-Mail-Adresse ist ungültig.")
    @Size(max = 255, message = "Die E-Mail-Adresse darf maximal 255 Zeichen lang sein.")
    private String email;

    @NotBlank(message = "Das Passwort darf nicht leer sein.")
    @Size(max = 255, message = "Das Passwort darf maximal 255 Zeichen lang sein.")
    private String passwordHash;

    @NotNull(message = "Die Benutzerrolle ist erforderlich.")
    private UserRole role;

    @NotNull(message = "Es muss angegeben werden, ob der Benutzer aktiv ist.")
    private Boolean active;

    public CreateUserRequest() {
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}