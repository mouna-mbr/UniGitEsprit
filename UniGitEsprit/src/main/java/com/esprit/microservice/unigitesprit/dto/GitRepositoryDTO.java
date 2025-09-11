// GitRepositoryDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GitRepositoryDTO {
    private Long id;
    private String name;
    private String fullName;
    private String description;
    private String url;
    private String defaultBranch;
    private boolean isPrivate;
    private String language;
    private int stars;
    private int forks;
    private long size;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private GitOwnerDTO owner;
}