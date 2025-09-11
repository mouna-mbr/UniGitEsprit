package com.esprit.microservice.unigitesprit.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class GroupCreateDTO {
    @NotNull(message = "Group name is required")
    @Size(min = 1, message = "Group name cannot be empty")
    private String nom;

    @NotNull(message = "Class ID is required")
    private Long classeId;

    @NotNull(message = "Sujet ID is required")
    private Long sujetId;

    @NotNull(message = "Enseignant ID is required")
    private Long enseignantId;

    private String gitRepoUrl;

    // Make gitRepoName optional
    private String gitRepoName;

    @NotNull(message = "Users are required")
    private List<UserRoleDTO> users;

    private boolean isFavori;

    // Getters and Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public Long getClasseId() { return classeId; }
    public void setClasseId(Long classeId) { this.classeId = classeId; }
    public Long getSujetId() { return sujetId; }
    public void setSujetId(Long sujetId) { this.sujetId = sujetId; }
    public Long getEnseignantId() { return enseignantId; }
    public void setEnseignantId(Long enseignantId) { this.enseignantId = enseignantId; }
    public String getGitRepoUrl() { return gitRepoUrl; }
    public void setGitRepoUrl(String gitRepoUrl) { this.gitRepoUrl = gitRepoUrl; }
    public String getGitRepoName() { return gitRepoName; }
    public void setGitRepoName(String gitRepoName) { this.gitRepoName = gitRepoName; }
    public List<UserRoleDTO> getUsers() { return users; }
    public void setUsers(List<UserRoleDTO> users) { this.users = users; }
    public boolean isFavori() { return isFavori; }
    public void setFavori(boolean favori) { this.isFavori = favori; }
}