// GitOwnerDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GitOwnerDTO {
    private String login;
    private String avatarUrl;
    private String type;
    private String url;
}