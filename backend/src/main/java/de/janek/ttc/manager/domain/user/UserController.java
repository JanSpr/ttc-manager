package de.janek.ttc.manager.domain.user;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST-Controller für Benutzer.
 *
 * Der Controller arbeitet ausschließlich mit Request-/Response-DTOs
 * und gibt keine JPA-Entities direkt nach außen zurück.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Gibt alle Benutzer zurück.
     *
     * @return Liste aller Benutzer als Response-DTOs
     */
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.findAll();
    }

    /**
     * Gibt einen Benutzer anhand seiner ID zurück.
     *
     * @param id Benutzer-ID
     * @return Benutzer als Response-DTO
     */
    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }

    /**
     * Erstellt einen neuen Benutzer.
     *
     * @param request Request-Daten für den Benutzer
     * @return erstellter Benutzer als Response-DTO
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.create(request);
    }

    /**
     * Aktualisiert einen bestehenden Benutzer.
     *
     * @param id Benutzer-ID
     * @param request neue Benutzerdaten
     * @return aktualisierter Benutzer als Response-DTO
     */
    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id, @Valid @RequestBody CreateUserRequest request) {
        return userService.update(id, request);
    }

    /**
     * Löscht einen Benutzer.
     *
     * @param id Benutzer-ID
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }

    /**
     * Fügt einen Benutzer einem Team hinzu.
     *
     * @param userId Benutzer-ID
     * @param teamId Team-ID
     * @return aktualisierter Benutzer als Response-DTO
     */
    @PostMapping("/{userId}/teams/{teamId}")
    public UserResponse addUserToTeam(@PathVariable Long userId, @PathVariable Long teamId) {
        return userService.addUserToTeam(userId, teamId);
    }

    /**
     * Entfernt einen Benutzer aus einem Team.
     *
     * @param userId Benutzer-ID
     * @param teamId Team-ID
     * @return aktualisierter Benutzer als Response-DTO
     */
    @DeleteMapping("/{userId}/teams/{teamId}")
    public UserResponse removeUserFromTeam(@PathVariable Long userId, @PathVariable Long teamId) {
        return userService.removeUserFromTeam(userId, teamId);
    }
}