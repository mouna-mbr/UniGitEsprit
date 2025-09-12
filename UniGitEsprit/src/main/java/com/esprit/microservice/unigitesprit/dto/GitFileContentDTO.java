// GitFileContentDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GitFileContentDTO {
    private String content;
    private String encoding;

    public GitFileContentDTO() {
    }
    public GitFileContentDTO(String content, String encoding) {}

    public String getContent() {
        return content;
    }

    public String getEncoding() {
        return encoding;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }
}