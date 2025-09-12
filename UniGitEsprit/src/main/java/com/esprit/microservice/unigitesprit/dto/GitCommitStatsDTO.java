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

    public GitCommitStatsDTO() {
    }

    public GitCommitStatsDTO(int additions, int deletions, int total) {
        this.additions = additions;
        this.deletions = deletions;
        this.total = total;
    }

    public int getAdditions() {
        return additions;
    }

    public int getDeletions() {
        return deletions;
    }

    public int getTotal() {
        return total;
    }

    public void setAdditions(int additions) {
        this.additions = additions;
    }

    public void setDeletions(int deletions) {
        this.deletions = deletions;
    }

    public void setTotal(int total) {
        this.total = total;
    }
}