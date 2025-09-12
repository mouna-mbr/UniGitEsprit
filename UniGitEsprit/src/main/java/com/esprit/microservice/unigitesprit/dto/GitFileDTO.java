// GitFileDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GitFileDTO {
    private String name;
    private String path;
    private String type;
    private long size;
    private String sha;
    private String downloadUrl;
    private String encoding;
    private GitLastCommitDTO lastCommit;

    public GitFileDTO() {
    }

    public GitFileDTO(String name, String path, String type, long size, String sha, String downloadUrl, String encoding, GitLastCommitDTO lastCommit) {
        this.name = name;
        this.path = path;
        this.type = type;
        this.size = size;
        this.sha = sha;
        this.downloadUrl = downloadUrl;
        this.encoding = encoding;
        this.lastCommit = lastCommit;
    }

    public String getName() {
        return name;
    }

    public String getPath() {
        return path;
    }

    public String getType() {
        return type;
    }

    public long getSize() {
        return size;
    }

    public String getSha() {
        return sha;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public String getEncoding() {
        return encoding;
    }

    public GitLastCommitDTO getLastCommit() {
        return lastCommit;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public void setSha(String sha) {
        this.sha = sha;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }

    public void setLastCommit(GitLastCommitDTO lastCommit) {
        this.lastCommit = lastCommit;
    }
}