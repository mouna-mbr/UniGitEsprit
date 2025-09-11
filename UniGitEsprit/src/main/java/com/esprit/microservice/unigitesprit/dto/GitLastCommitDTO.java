// GitLastCommitDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GitLastCommitDTO {
    private String message;
    private String author;
    private LocalDateTime date;
    private String sha;
}