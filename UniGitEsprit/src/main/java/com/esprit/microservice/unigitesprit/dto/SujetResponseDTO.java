package com.esprit.microservice.unigitesprit.dto;

public class SujetResponseDTO {
    private Long id;
    private String titre;
    private boolean favori;
    private String description;
    private Long proposeParId;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public boolean isFavori() {
        return favori;
    }

    public void setFavori(boolean favori) {
        this.favori = favori;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getProposeParId() {
        return proposeParId;
    }

    public void setProposeParId(Long proposeParId) {
        this.proposeParId = proposeParId;
    }
}