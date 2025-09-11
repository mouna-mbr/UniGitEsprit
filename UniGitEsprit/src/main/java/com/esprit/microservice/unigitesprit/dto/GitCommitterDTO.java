// GitCommitterDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GitCommitterDTO {
    private String name;
    private String email;
    private LocalDateTime date;
}