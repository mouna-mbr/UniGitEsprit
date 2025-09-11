package com.esprit.microservice.unigitesprit.dto;

import lombok.Data;

import java.util.Set;

@Data
public class GroupResponseDTO {
    private Long id;
    private String nom;
    private Long classeId;
    private Set<UserRoleResponseDTO> users;
    private Long sujetId;
    private String gitRepoUrl;
    private String gitRepoName;
    private boolean isFavori;
    private Long enseignantId;
    public void setIsFavori(boolean isFavori) {
        this.isFavori = isFavori;
    }
}