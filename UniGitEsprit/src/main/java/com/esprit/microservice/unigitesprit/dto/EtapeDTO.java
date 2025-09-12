package com.esprit.microservice.unigitesprit.dto;

import java.time.LocalDate;

public class EtapeDTO {
    private Long id;
    private String nom;
    private String consigne;
    private LocalDate deadline;
    private Long pipelineId;
    private String gitRepoUrl; // Optional: Include Group's gitRepoUrl

    public Long getPipelineId() {
        return pipelineId;
    }

    public void setPipelineId(Long pipelineId) {
        this.pipelineId = pipelineId;
    }

    public EtapeDTO() {
    }

    public EtapeDTO(Long id, String nom, String consigne, LocalDate deadline, Long id1, String gitRepoUrl) {
        this.id = id;
        this.nom = nom;
        this.consigne = consigne;
        this.deadline = deadline;
        this.pipelineId = id1;
        this.gitRepoUrl = gitRepoUrl;
    }
    public EtapeDTO(Long id, String nom, String consigne, LocalDate deadline, Long id1) {
        this.id = id;
        this.nom = nom;
        this.consigne = consigne;
        this.deadline = deadline;
        this.pipelineId = id1;
    }

    public String getGitRepoUrl() {
        return gitRepoUrl;
    }

    public void setGitRepoUrl(String gitRepoUrl) {
        this.gitRepoUrl = gitRepoUrl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getConsigne() { return consigne; }
    public void setConsigne(String consigne) { this.consigne = consigne; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
}
