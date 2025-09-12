//GitCommitDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GitCommitDTO {
    private String sha;
    private String message;
    private GitAuthorDTO author;
    private GitCommitterDTO committer;
    private GitCommitStatsDTO stats;
    private List<GitFileChangeDTO> files;
    private String url;

    public GitCommitDTO() {
    }

    public GitCommitDTO(String sha, String message, GitAuthorDTO author, GitCommitterDTO committer, GitCommitStatsDTO stats, List<GitFileChangeDTO> files, String url) {
        this.sha = sha;
        this.message = message;
        this.author = author;
        this.committer = committer;
        this.stats = stats;
        this.files = files;
        this.url = url;
    }

    public String getSha() {
        return sha;
    }

    public String getMessage() {
        return message;
    }

    public GitAuthorDTO getAuthor() {
        return author;
    }

    public GitCommitterDTO getCommitter() {
        return committer;
    }

    public GitCommitStatsDTO getStats() {
        return stats;
    }

    public List<GitFileChangeDTO> getFiles() {
        return files;
    }

    public String getUrl() {
        return url;
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

    public void setCommitter(GitCommitterDTO committer) {
        this.committer = committer;
    }

    public void setStats(GitCommitStatsDTO stats) {
        this.stats = stats;
    }

    public void setFiles(List<GitFileChangeDTO> files) {
        this.files = files;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}