package com.esprit.microservice.unigitesprit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SujetCreateDTO {
    @NotBlank(message = "Titre is required")
    private String titre;

    private String description;

    @NotNull(message = "Propose par is required")
    private Long proposeParId;

    // Getters and Setters
    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
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