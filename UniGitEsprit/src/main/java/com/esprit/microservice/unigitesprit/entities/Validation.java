package com.esprit.microservice.unigitesprit.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Validation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateValidation;

    @ElementCollection
    @CollectionTable(name = "validation_remarques", joinColumns = @JoinColumn(name = "validation_id"))
    @Column(name = "remarque")
    private List<String> remarques = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "etape_id", nullable = false)
    private Etape etape;

    @ManyToMany
    @JoinTable(
            name = "validation_users",
            joinColumns = @JoinColumn(name = "validation_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> etudiants = new ArrayList<>();
    @ManyToOne
    private  User professor;

    private Double note;

    public Validation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateValidation() {
        return dateValidation;
    }

    public void setDateValidation(LocalDate dateValidation) {
        this.dateValidation = dateValidation;
    }

    public List<String> getRemarques() {
        return remarques;
    }

    public void setRemarques(List<String> remarques) {
        this.remarques = remarques;
    }

    public Etape getEtape() {
        return etape;
    }

    public void setEtape(Etape etape) {
        this.etape = etape;
    }

    public List<User> getEtudiants() {
        return etudiants;
    }

    public void setEtudiants(List<User> etudiants) {
        this.etudiants = etudiants;
    }

    public Double getNote() {
        return note;
    }

    public void setNote(Double note) {
        this.note = note;
    }
}
