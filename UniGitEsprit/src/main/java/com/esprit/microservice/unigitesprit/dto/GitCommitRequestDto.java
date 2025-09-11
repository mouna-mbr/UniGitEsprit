package com.esprit.microservice.unigitesprit.dto;

import lombok.Data;

@Data
public class GitCommitRequestDto {
    private String repoUrl;
    private String branch;
    private Integer page;
    private Integer perPage;
    private String sha;
}
