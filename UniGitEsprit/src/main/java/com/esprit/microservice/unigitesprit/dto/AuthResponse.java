package com.esprit.microservice.unigitesprit.dto;

import java.util.Set;

public class AuthResponse {
    public String token;
    public UserResponseDTO user;

    public AuthResponse(String token, UserResponseDTO user) {
        this.token = token;
        this.user = user;
    }
}
