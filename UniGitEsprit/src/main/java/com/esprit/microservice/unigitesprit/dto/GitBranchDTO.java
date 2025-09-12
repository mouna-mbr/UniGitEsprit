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

    public GitBranchDTO() {
    }
    public GitBranchDTO(String name, GitBranchCommitDTO commit, boolean protectedBranch) {}

    public String getName() {
        return name;
    }

    public GitBranchCommitDTO getCommit() {
        return commit;
    }

    public boolean isProtectedBranch() {
        return protectedBranch;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCommit(GitBranchCommitDTO commit) {
        this.commit = commit;
    }

    public void setProtectedBranch(boolean protectedBranch) {
        this.protectedBranch = protectedBranch;
    }
}