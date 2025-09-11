package com.esprit.microservice.unigitesprit.dto;

import lombok.Data;

@Data
public class GitFileContentRequestDto {
    private String repoUrl;
    private String path;
    private String branch;
}
