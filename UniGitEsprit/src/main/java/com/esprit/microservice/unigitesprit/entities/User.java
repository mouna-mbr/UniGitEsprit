package com.esprit.microservice.unigitesprit.entities;

import com.esprit.microservice.unigitesprit.enumeration.Role;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles = new HashSet<>();

    public Entreprise getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(Entreprise entreprise) {
        this.entreprise = entreprise;
    }

    @Column(nullable = false, unique = true)
    private String identifiant;

    @Column(nullable = false)
    private String password;

    private String classe;

    private String specialite;
    @OneToOne
    @JoinColumn(name = "entreprise_id")// Optional
    private Entreprise entreprise; // Optional
    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "git_username") // Optional
    private String gitUsername;

    @Column(name = "git_access_token") // Optional
    private String gitAccessToken;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public User() {}

    public User(String firstName, String lastName, HashSet<Role> role, String identifiant, String password,
                String classe, String specialite, String email, String gitUsername, String gitAccessToken) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = role;
        this.identifiant = identifiant;
        this.password = password; // Will be encoded in service
        this.classe = classe;
        this.specialite = specialite;
        this.email = email;
        this.gitUsername = gitUsername;
        this.gitAccessToken = gitAccessToken;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public HashSet<Role> getRole() {
        return new HashSet<>(roles);
    }
    public void setRole(HashSet<Role> role) { this.roles = role; }

    public String getIdentifiant() { return identifiant; }
    public void setIdentifiant(String identifiant) { this.identifiant = identifiant; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getClasse() { return classe; }
    public void setClasse(String classe) { this.classe = classe; }

    public String getSpecialite() { return specialite; }
    public void setSpecialite(String specialite) { this.specialite = specialite; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGitUsername() { return gitUsername; }
    public void setGitUsername(String gitUsername) { this.gitUsername = gitUsername; }

    public String getGitAccessToken() { return gitAccessToken; }
    public void setGitAccessToken(String gitAccessToken) { this.gitAccessToken = gitAccessToken; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
