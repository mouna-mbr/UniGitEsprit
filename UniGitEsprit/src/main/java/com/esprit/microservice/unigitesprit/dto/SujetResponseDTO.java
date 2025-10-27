package com.esprit.microservice.unigitesprit.dto;

import com.esprit.microservice.unigitesprit.enumeration.TechnoLogies;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Set;

public class SujetResponseDTO {
    private Long id;
    private String titre;
    private boolean favori;
    private String description;
    private Long proposeParId;
    @JsonProperty("technologies")
    private Set<TechnoLogies> technologies;
    public Set<GroupResponseDTO> groups;
    // Getters and Setters

    public Set<TechnoLogies> getTechnologies() {
        return technologies;
    }

    public Set<GroupResponseDTO> getGroups() {
        return groups;
    }

    public void setGroups(Set<GroupResponseDTO> groups) {
        this.groups = groups;
    }

    public void setTechnologies(Set<TechnoLogies> technologies) {
        this.technologies = technologies;
    }

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