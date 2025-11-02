package com.esprit.microservice.unigitesprit.entities;

import com.esprit.microservice.unigitesprit.entities.Group;
import com.esprit.microservice.unigitesprit.entities.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "favoris", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "group_id"}))
public class Favoris {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    public Favoris(User user, Group group) {
        this.user = user;
        this.group = group;
    }

    public Favoris() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
