package com.esprit.microservice.unigitesprit.dto;
import com.esprit.microservice.unigitesprit.enumeration.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.HashSet;
import java.util.Set;

public class UserCreateDTO {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotEmpty(message = "Au moins un rôle est requis")
    private Set<Role> roles = new HashSet<>(); // Initialiser pour éviter null

    @NotBlank(message = "Identifiant is required")
    private String identifiant;

    @NotBlank(message = "Password is required")
    private String password;

    private String classe;

    private String specialite;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String gitUsername;
    private String gitAccessToken;

    // CORRECTION: Getters et Setters corrects
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    // CORRECTION: getRoles() et setRoles() au pluriel
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) {
        this.roles = roles != null ? roles : new HashSet<>();
    }

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
}