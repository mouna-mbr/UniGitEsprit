package com.esprit.microservice.unigitesprit.entities;

import com.esprit.microservice.unigitesprit.enumeration.Status;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Tache {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String description;

    @Enumerated(EnumType.STRING)
    private Status status;

    private LocalDate deadline;

    private Long assigneeId;

    @ManyToOne
    @JoinColumn(name = "etape_id", nullable = false)
    private Etape etape;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public Long getAssigneeId() { return assigneeId; }
    public void setAssigneeId(Long assigneeId) { this.assigneeId = assigneeId; }
    public Etape getEtape() { return etape; }
    public void setEtape(Etape etape) { this.etape = etape; }
}