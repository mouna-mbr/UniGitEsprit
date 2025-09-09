package com.esprit.microservice.unigitesprit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UserLoginDTO {
    @NotBlank(message = "Identifiant is required")
    @Pattern(regexp = "^\\d{3}[A-Z]{3}\\d{4}$", message = "Invalid identifiant format")
    private String identifiant;

    @NotBlank(message = "Password is required")
    private String password;

    // Getters and setters
    public String getIdentifiant() {
        return identifiant;
    }

    public void setIdentifiant(String identifiant) {
        this.identifiant = identifiant;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}