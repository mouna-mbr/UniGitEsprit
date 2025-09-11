// GitBranchCommitDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GitBranchCommitDTO {
    private String sha;
    private String message;
    private GitAuthorDTO author;
}