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
}