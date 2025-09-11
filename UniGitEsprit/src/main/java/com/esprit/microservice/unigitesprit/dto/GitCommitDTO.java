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
}