package com.esprit.microservice.unigitesprit.entities;

import com.esprit.microservice.unigitesprit.enumeration.TechnoLogies;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sujets")
public class Sujet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titre", nullable = false)
    private String titre;

    @Column(name = "favori")
    private boolean favori;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "propose_par", nullable = false)
    private User proposePar;

    @ElementCollection(targetClass = TechnoLogies.class, fetch = FetchType.EAGER)
    @CollectionTable(
            name = "sujet_technologies",
            joinColumns = @JoinColumn(name = "sujet_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "technology", nullable = false)
    private Set<TechnoLogies> technologies = new HashSet<>();


    // Getters and Setters

    public Set<TechnoLogies> getTechnologies() {
        return technologies;
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

    public User getProposePar() {
        return proposePar;
    }

    public void setProposePar(User proposePar) {
        this.proposePar = proposePar;
    }
}