package com.esprit.microservice.unigitesprit.entities;

import com.esprit.microservice.unigitesprit.enumeration.NiveauEnum;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Classe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String anneeUniversitaire;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NiveauEnum level;

    @Column(nullable = false)
    private String optionFormation;

    private boolean favori;

    @ManyToMany
    @JoinTable(
            name = "classe_etudiant",
            joinColumns = @JoinColumn(name = "classe_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> etudiants = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "classe_enseignant",
            joinColumns = @JoinColumn(name = "classe_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> enseignants = new HashSet<>();

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
    public Set<User> getEtudiants() { return etudiants; }
    public void setEtudiants(Set<User> etudiants) { this.etudiants = etudiants; }
    public Set<User> getEnseignants() { return enseignants; }
    public void setEnseignants(Set<User> enseignants) { this.enseignants = enseignants; }
}