package com.esprit.microservice.unigitesprit.dto;

import com.esprit.microservice.unigitesprit.enumeration.Role;

import java.util.Set;

// UserUpdateDTO.java
public class UserUpdateDTO {
    private String firstName, lastName, classe, specialite, email, gitUsername, gitAccessToken;
    private Set<Role> roles;

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setClasse(String classe) {
        this.classe = classe;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setGitUsername(String gitUsername) {
        this.gitUsername = gitUsername;
    }

    public void setGitAccessToken(String gitAccessToken) {
        this.gitAccessToken = gitAccessToken;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getClasse() {
        return classe;
    }

    public String getSpecialite() {
        return specialite;
    }

    public String getEmail() {
        return email;
    }

    public String getGitUsername() {
        return gitUsername;
    }

    public String getGitAccessToken() {
        return gitAccessToken;
    }

    public Set<Role> getRoles() {
        return roles;
    }
}
