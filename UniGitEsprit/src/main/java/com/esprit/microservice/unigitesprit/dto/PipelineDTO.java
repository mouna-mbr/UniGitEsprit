package com.esprit.microservice.unigitesprit.dto;

import java.util.List;

public class PipelineDTO {
    private Long id;
    private String nom;
    private Long groupId;
    private List<EtapeDTO> etapes;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public List<EtapeDTO> getEtapes() { return etapes; }
    public void setEtapes(List<EtapeDTO> etapes) { this.etapes = etapes; }
}
