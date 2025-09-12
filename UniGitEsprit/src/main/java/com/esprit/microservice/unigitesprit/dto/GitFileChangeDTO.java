// GitFileChangeDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GitFileChangeDTO {
    private String filename;
    private String status;
    private int additions;
    private int deletions;


    private int changes;
    public GitFileChangeDTO() {
    }

    public GitFileChangeDTO(String filename, String status, int additions, int deletions, int changes) {
        this.filename = filename;
        this.status = status;
        this.additions = additions;
        this.deletions = deletions;
        this.changes = changes;
    }

    public String getFilename() {
        return filename;
    }

    public String getStatus() {
        return status;
    }

    public int getAdditions() {
        return additions;
    }

    public int getDeletions() {
        return deletions;
    }

    public int getChanges() {
        return changes;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setAdditions(int additions) {
        this.additions = additions;
    }

    public void setDeletions(int deletions) {
        this.deletions = deletions;
    }

    public void setChanges(int changes) {
        this.changes = changes;
    }
}