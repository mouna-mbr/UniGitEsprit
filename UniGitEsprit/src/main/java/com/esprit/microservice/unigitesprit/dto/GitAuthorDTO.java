// GitAuthorDTO.java (can be reused across commits)
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GitAuthorDTO {
    private String name;
    private String email;
    private String avatarUrl;
    private LocalDateTime date;

    public GitAuthorDTO() {
    }

    public GitAuthorDTO(String name, String email, String avatarUrl, LocalDateTime date) {
        this.name = name;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}