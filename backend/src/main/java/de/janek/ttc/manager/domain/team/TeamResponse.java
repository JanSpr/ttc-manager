package de.janek.ttc.manager.domain.team;

/**
 * Response-DTO für Mannschaften.
 */
public class TeamResponse {

    private Long id;
    private String name;
    private String description;
    private int memberCount;

    public TeamResponse() {
    }

    public TeamResponse(Long id, String name, String description, int memberCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.memberCount = memberCount;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getMemberCount() {
        return memberCount;
    }
}