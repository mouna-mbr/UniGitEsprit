package com.esprit.microservice.unigitesprit.dto;

import java.time.LocalDate;
import java.util.List;

public class ValidationDTO {
    private Long id;
    private LocalDate dateValidation;
    private List<String> remarques;
    private Long etapeId;
    private List<Long> etudiantIds;
    private Double note;

    public ValidationDTO() {
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

    public Long getEtapeId() {
        return etapeId;
    }

    public void setEtapeId(Long etapeId) {
        this.etapeId = etapeId;
    }

    public List<Long> getEtudiantIds() {
        return etudiantIds;
    }

    public void setEtudiantIds(List<Long> etudiantIds) {
        this.etudiantIds = etudiantIds;
    }

    public Double getNote() {
        return note;
    }

    public void setNote(Double note) {
        this.note = note;
    }
}
