// GitFileContentDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GitFileContentDTO {
    private String content;
    private String encoding;
}