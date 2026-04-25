package de.janek.ttc.manager.domain.user;

import de.janek.ttc.manager.domain.member.Member;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "app_user", uniqueConstraints = { @UniqueConstraint(name = "uk_app_user_email", columnNames = "email"),
		@UniqueConstraint(name = "uk_app_user_username", columnNames = "username") })
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "first_name", nullable = false, length = 100)
	private String firstName;

	@Column(name = "last_name", nullable = false, length = 100)
	private String lastName;

	@Column(name = "username", nullable = false, length = 100, unique = true)
	private String username;

	/**
	 * 🔥 OPTIONAL
	 */
	@Column(name = "email", nullable = true, length = 255, unique = true)
	private String email;

	/**
	 * 🔥 OPTIONAL
	 */
	@Column(name = "password_hash", nullable = true, length = 255)
	private String passwordHash;

	@ElementCollection(targetClass = GlobalRole.class)
	@Enumerated(EnumType.STRING)
	@CollectionTable(name = "user_global_role", joinColumns = @JoinColumn(name = "user_id"))
	@Column(name = "role")
	private Set<GlobalRole> roles = new HashSet<>();

	@Column(name = "active", nullable = false)
	private boolean active = true;

	@OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
	private Member member;

	public User() {
	}

	public User(String firstName, String lastName) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.active = true;
	}

	public User(String firstName, String lastName, String username, String email, String passwordHash) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.email = email;
		this.passwordHash = passwordHash;
		this.active = true;
	}

	public Long getId() {
		return id;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getFullName() {
		return firstName + " " + lastName;
	}

	public String getUsername() {
		return username;
	}

	public String getEmail() {
		return email;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public Set<GlobalRole> getRoles() {
		return roles;
	}

	public boolean isActive() {
		return active;
	}

	public Member getMember() {
		return member;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public void setRoles(Set<GlobalRole> roles) {
		this.roles = roles;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public void setMember(Member member) {
		this.member = member;
		if (member != null && member.getUser() != this) {
			member.setUser(this);
		}
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (!(o instanceof User appUser))
			return false;
		return id != null && Objects.equals(id, appUser.id);
	}

	@Override
	public int hashCode() {
		return getClass().hashCode();
	}
}