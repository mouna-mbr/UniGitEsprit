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
}