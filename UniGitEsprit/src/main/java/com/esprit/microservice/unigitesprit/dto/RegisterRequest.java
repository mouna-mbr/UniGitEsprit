package com.esprit.microservice.unigitesprit.dto;

import java.util.Set;

public class RegisterRequest {
    public String username;
    public String password;
    public String email;
    public Set<String> roles;
}
