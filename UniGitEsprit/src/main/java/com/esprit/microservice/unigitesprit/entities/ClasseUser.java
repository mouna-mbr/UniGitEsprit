package com.esprit.microservice.unigitesprit.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "classe_user")
public class ClasseUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "classe_id", nullable = false)
    private Classe classe;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Getters et setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Classe getClasse() { return classe; }
    public void setClasse(Classe classe) { this.classe = classe; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}