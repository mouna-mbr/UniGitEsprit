package com.esprit.microservice.unigitesprit.dto;

import com.esprit.microservice.unigitesprit.enumeration.NiveauEnum;

import java.util.List;
import java.util.Set;

public class ClasseResponseDTO {
    private Long id;
    private String nom;
    private String anneeUniversitaire;
    private NiveauEnum level;
    private String optionFormation;
    private boolean favori;
    private List<Long> sujetIds;
    private Set<Long> etudiantIds;
    private Set<Long> enseignantIds;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getAnneeUniversitaire() { return anneeUniversitaire; }
    public void setAnneeUniversitaire(String anneeUniversitaire) { this.anneeUniversitaire = anneeUniversitaire; }

    public NiveauEnum getLevel() { return level; }
    public void setLevel(NiveauEnum level) { this.level = level; }

    public String getOptionFormation() { return optionFormation; }
    public void setOptionFormation(String optionFormation) { this.optionFormation = optionFormation; }

    public boolean isFavori() { return favori; }
    public void setFavori(boolean favori) { this.favori = favori; }

    public List<Long> getSujetIds() { return sujetIds; }
    public void setSujetIds(List<Long> sujetIds) { this.sujetIds = sujetIds; }

    public Set<Long> getEtudiantIds() { return etudiantIds; }
    public void setEtudiantIds(Set<Long> etudiantIds) { this.etudiantIds = etudiantIds; }

    public Set<Long> getEnseignantIds() { return enseignantIds; }
    public void setEnseignantIds(Set<Long> enseignantIds) { this.enseignantIds = enseignantIds; }
}