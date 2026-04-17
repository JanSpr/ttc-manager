package de.janek.ttc.manager.domain.team;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request-DTO zum Erstellen einer Mannschaft.
 */
public class CreateTeamRequest {

    @NotBlank(message = "Der Teamname darf nicht leer sein.")
    @Size(max = 150, message = "Der Teamname darf maximal 150 Zeichen lang sein.")
    private String name;

    @Size(max = 500, message = "Die Beschreibung darf maximal 500 Zeichen lang sein.")
    private String description;

    public CreateTeamRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}