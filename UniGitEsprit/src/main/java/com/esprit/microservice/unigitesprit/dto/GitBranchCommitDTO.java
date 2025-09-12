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
    public GitBranchCommitDTO() {
    }
    public GitBranchCommitDTO(String sha, String message, GitAuthorDTO author) {}

    public String getSha() {
        return sha;
    }

    public String getMessage() {
        return message;
    }

    public GitAuthorDTO getAuthor() {
        return author;
    }

    public void setSha(String sha) {
        this.sha = sha;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setAuthor(GitAuthorDTO author) {
        this.author = author;
    }
}