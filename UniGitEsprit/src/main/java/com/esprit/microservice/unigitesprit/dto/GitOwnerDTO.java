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

    public GitOwnerDTO() {
    }
    public GitOwnerDTO(String login, String avatarUrl, String type, String url) {
        this.login = login;
        this.avatarUrl = avatarUrl;
        this.type = type;
        this.url = url;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getLogin() {
        return login;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public String getType() {
        return type;
    }

    public String getUrl() {
        return url;
    }
}