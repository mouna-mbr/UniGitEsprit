package com.esprit.microservice.unigitesprit.dto;

import lombok.Data;

@Data
public class GitRepositoryRequestDto {
    private String repoUrl;
    private String branch;
    private String path;
    private Integer page;
    private Integer perPage;
    private  String query;
}
