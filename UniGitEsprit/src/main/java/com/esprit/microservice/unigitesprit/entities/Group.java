package com.esprit.microservice.unigitesprit.entities;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "`group`") // Escape the reserved keyword with backticks
public class Group {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private boolean favori;
    private String gitRepoUrl;
    private String gitRepoName;

    @ManyToOne
    @JoinColumn(name = "classe_id")
    private Classe classe;

    @ManyToOne
    @JoinColumn(name = "sujet_id")
    private Sujet sujet;

    @ManyToOne
    @JoinColumn(name = "enseignant_id")
    private User enseignant;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UserGroup> users = new HashSet<>();

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : super.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Group other = (Group) obj;
        return id != null && id.equals(other.id);
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public boolean isFavori() { return favori; }
    public void setFavori(boolean favori) { this.favori = favori; }
    public String getGitRepoUrl() { return gitRepoUrl; }
    public void setGitRepoUrl(String gitRepoUrl) { this.gitRepoUrl = gitRepoUrl; }
    public String getGitRepoName() { return gitRepoName; }
    public void setGitRepoName(String gitRepoName) { this.gitRepoName = gitRepoName; }
    public Classe getClasse() { return classe; }
    public void setClasse(Classe classe) { this.classe = classe; }
    public Sujet getSujet() { return sujet; }
    public void setSujet(Sujet sujet) { this.sujet = sujet; }
    public User getEnseignant() { return enseignant; }
    public void setEnseignant(User enseignant) { this.enseignant = enseignant; }
    public Set<UserGroup> getUsers() { return users; }
    public void setUsers(Set<UserGroup> users) { this.users = users; }
}