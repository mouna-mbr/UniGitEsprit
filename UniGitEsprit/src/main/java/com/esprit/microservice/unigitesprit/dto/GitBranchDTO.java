// GitBranchDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GitBranchDTO {
    private String name;
    private GitBranchCommitDTO commit;
    private boolean protectedBranch;
}