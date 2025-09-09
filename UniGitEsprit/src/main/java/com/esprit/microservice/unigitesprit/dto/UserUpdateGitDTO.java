package com.esprit.microservice.unigitesprit.dto;

import jakarta.validation.constraints.Size;

public class UserUpdateGitDTO {
    @Size(min = 2, max = 39, message = "Git username must be between 2 and 39 characters")
    private String gitUsername;

    @Size(min = 20, max = 255, message = "Git access token must be between 20 and 255 characters")
    private String gitAccessToken;

    public String getGitUsername() {
        return gitUsername;
    }

    public void setGitUsername(String gitUsername) {
        this.gitUsername = gitUsername;
    }

    public String getGitAccessToken() {
        return gitAccessToken;
    }

    public void setGitAccessToken(String gitAccessToken) {
        this.gitAccessToken = gitAccessToken;
    }
}