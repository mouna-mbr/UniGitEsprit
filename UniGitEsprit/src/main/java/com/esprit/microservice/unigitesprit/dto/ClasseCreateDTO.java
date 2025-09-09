package com.esprit.microservice.unigitesprit.dto;

import com.esprit.microservice.unigitesprit.enumeration.NiveauEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Set;

public class ClasseCreateDTO {
    @NotBlank(message = "Class name is required")
    private String nom;

    @NotBlank(message = "Academic year is required")
    private String anneeUniversitaire;

    @NotNull(message = "Level is required")
    private NiveauEnum level;

    @NotBlank(message = "Formation option is required")
    private String optionFormation;

    private List<Long> sujetIds;

    private Set<Long> etudiantIds;

    private Set<Long> enseignantIds;

    // Getters and Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getAnneeUniversitaire() { return anneeUniversitaire; }
    public void setAnneeUniversitaire(String anneeUniversitaire) { this.anneeUniversitaire = anneeUniversitaire; }

    public NiveauEnum getLevel() { return level; }
    public void setLevel(NiveauEnum level) { this.level = level; }

    public String getOptionFormation() { return optionFormation; }
    public void setOptionFormation(String optionFormation) { this.optionFormation = optionFormation; }

    public List<Long> getSujetIds() { return sujetIds; }
    public void setSujetIds(List<Long> sujetIds) { this.sujetIds = sujetIds; }

    public Set<Long> getEtudiantIds() { return etudiantIds; }
    public void setEtudiantIds(Set<Long> etudiantIds) { this.etudiantIds = etudiantIds; }

    public Set<Long> getEnseignantIds() { return enseignantIds; }
    public void setEnseignantIds(Set<Long> enseignantIds) { this.enseignantIds = enseignantIds; }
}