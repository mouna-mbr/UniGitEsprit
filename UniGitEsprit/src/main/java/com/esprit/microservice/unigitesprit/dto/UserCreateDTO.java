package com.esprit.microservice.unigitesprit.dto;
import com.esprit.microservice.unigitesprit.enumeration.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.HashSet;
import java.util.Set;

public class UserCreateDTO {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Role is required")
    private HashSet<Role> role;

    @NotBlank(message = "Identifiant is required")
    private String identifiant;

    @NotBlank(message = "Password is required")
    private String password;

    private String classe; // Optional

    private String specialite; // Optional

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    public @NotBlank(message = "Last name is required") String getLastName() {
        return lastName;
    }

    public HashSet<Role> getRole() {
        return role;
    }

    public @NotBlank(message = "Identifiant is required") String getIdentifiant() {
        return identifiant;
    }

    public @NotBlank(message = "Password is required") String getPassword() {
        return password;
    }

    public String getClasse() {
        return classe;
    }

    public String getSpecialite() {
        return specialite;
    }

    public @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String getEmail() {
        return email;
    }

    public String getGitUsername() {
        return gitUsername;
    }

    public String getGitAccessToken() {
        return gitAccessToken;
    }

    // Git fields optional, no validation needed
    private String gitUsername;

    private String gitAccessToken;

    // Constructors, Getters, Setters
    public UserCreateDTO() {}

    // Getters and Setters (omitted for brevity; add them similarly to entity)
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
}