package com.esprit.microservice.unigitesprit.entities;

import com.esprit.microservice.unigitesprit.enumeration.DemandeStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeParainage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    private Entreprise entreprise;
    @ManyToOne
    private Sujet sujet;

    @Enumerated(EnumType.STRING)
    private DemandeStatus status;
}
