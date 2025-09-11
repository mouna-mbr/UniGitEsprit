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
}