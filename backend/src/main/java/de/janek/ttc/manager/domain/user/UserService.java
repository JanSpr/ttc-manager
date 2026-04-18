package de.janek.ttc.manager.domain.user;

import de.janek.ttc.manager.common.exception.ResourceNotFoundException;
import de.janek.ttc.manager.domain.team.Team;
import de.janek.ttc.manager.domain.team.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service für Benutzerverwaltung.
 *
 * Der Service enthält die Fachlogik der User-Domäne:
 * - Laden und Speichern von Benutzern
 * - Prüfen fachlicher Regeln, z. B. eindeutige E-Mail-Adresse
 * - Verwalten von Team-Zuordnungen
 * - Mapping zwischen Entity und Response-DTO
 */
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    public UserService(UserRepository userRepository, TeamRepository teamRepository) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
    }

    /**
     * Liefert alle Benutzer.
     *
     * @return Liste aller Benutzer als Response-DTOs
     */
    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll(org.springframework.data.domain.Sort.by("id"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Liefert einen Benutzer anhand seiner ID.
     *
     * @param id Benutzer-ID
     * @return Benutzer als Response-DTO
     */
    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return toResponse(getUserEntityById(id));
    }

    /**
     * Erstellt einen neuen Benutzer.
     *
     * @param request Request-Daten
     * @return gespeicherter Benutzer als Response-DTO
     */
    public UserResponse create(CreateUserRequest request) {
        validateUniqueEmail(request.getEmail(), null);

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPasswordHash());
        user.setRole(request.getRole());
        user.setActive(request.getActive());

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    /**
     * Aktualisiert einen bestehenden Benutzer.
     *
     * @param id Benutzer-ID
     * @param request neue Benutzerdaten
     * @return aktualisierter Benutzer als Response-DTO
     */
    public UserResponse update(Long id, CreateUserRequest request) {
        User existingUser = getUserEntityById(id);

        validateUniqueEmail(request.getEmail(), id);

        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());
        existingUser.setEmail(request.getEmail());
        existingUser.setPasswordHash(request.getPasswordHash());
        existingUser.setRole(request.getRole());
        existingUser.setActive(request.getActive());

        User savedUser = userRepository.save(existingUser);
        return toResponse(savedUser);
    }

    /**
     * Löscht einen Benutzer.
     *
     * Vor dem Löschen werden vorhandene Team-Zuordnungen entfernt,
     * damit die Many-to-Many-Beziehung sauber bleibt.
     *
     * @param id Benutzer-ID
     */
    public void delete(Long id) {
        User user = getUserEntityById(id);

        for (Team team : List.copyOf(user.getTeams())) {
            user.removeTeam(team);
        }

        userRepository.delete(user);
    }

    /**
     * Fügt einen Benutzer zu einem Team hinzu.
     *
     * @param userId Benutzer-ID
     * @param teamId Team-ID
     * @return aktualisierter Benutzer als Response-DTO
     */
    public UserResponse addUserToTeam(Long userId, Long teamId) {
        User user = getUserEntityById(userId);
        Team team = getTeamEntityById(teamId);

        user.addTeam(team);

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    /**
     * Entfernt einen Benutzer aus einem Team.
     *
     * @param userId Benutzer-ID
     * @param teamId Team-ID
     * @return aktualisierter Benutzer als Response-DTO
     */
    public UserResponse removeUserFromTeam(Long userId, Long teamId) {
        User user = getUserEntityById(userId);
        Team team = getTeamEntityById(teamId);

        user.removeTeam(team);

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    /**
     * Lädt ein User-Entity anhand seiner ID.
     *
     * @param id Benutzer-ID
     * @return User-Entity
     */
    private User getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User mit ID " + id + " wurde nicht gefunden."
                ));
    }

    /**
     * Lädt ein Team-Entity anhand seiner ID.
     *
     * @param id Team-ID
     * @return Team-Entity
     */
    private Team getTeamEntityById(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Team mit ID " + id + " wurde nicht gefunden."
                ));
    }

    /**
     * Prüft, ob eine E-Mail-Adresse bereits durch einen anderen Benutzer belegt ist.
     *
     * @param email gewünschte E-Mail-Adresse
     * @param currentUserId ID des aktuell bearbeiteten Benutzers; bei Neuanlage null
     */
    private void validateUniqueEmail(String email, Long currentUserId) {
        userRepository.findByEmail(email).ifPresent(existingUser -> {
            boolean isDifferentUser = currentUserId == null || !existingUser.getId().equals(currentUserId);

            if (isDifferentUser) {
                throw new IllegalArgumentException(
                        "Ein Benutzer mit der E-Mail-Adresse '" + email + "' existiert bereits."
                );
            }
        });
    }

    /**
     * Wandelt ein User-Entity in ein Response-DTO um.
     *
     * @param user User-Entity
     * @return UserResponse
     */
    private UserResponse toResponse(User user) {
        Set<Long> teamIds = user.getTeams()
                .stream()
                .map(Team::getId)
                .collect(Collectors.toSet());

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                teamIds
        );
    }
}