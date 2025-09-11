// GitCommitStatsDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GitCommitStatsDTO {
    private int additions;
    private int deletions;
    private int total;
}