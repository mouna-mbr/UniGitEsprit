package com.esprit.microservice.unigitesprit.dto;

import com.esprit.microservice.unigitesprit.enumeration.TechnoLogies;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public class SujetCreateDTO {
    @NotBlank(message = "Titre is required")
    private String titre;

    private String description;

    @NotNull(message = "Propose par is required")
    private Long proposeParId;

    @JsonProperty("technologies")
    private Set<TechnoLogies> technologies;

    // Getters and Setters

    public Set<TechnoLogies> getTechnologies() {
        return technologies;
    }

    public void setTechnologies(Set<TechnoLogies> technologies) {
        this.technologies = technologies;
    }

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