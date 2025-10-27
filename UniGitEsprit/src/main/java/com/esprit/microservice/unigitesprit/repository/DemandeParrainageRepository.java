package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.DemandeParainage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DemandeParrainageRepository extends JpaRepository<DemandeParainage, Long> {
    @Query("SELECT d.status, COUNT(d) FROM DemandeParainage d GROUP BY d.status")
    List<Object[]> countByStatus();

    @Query("SELECT s.titre, COUNT(d) FROM DemandeParainage d JOIN d.sujet s GROUP BY s.titre")
    List<Object[]> countBySujet();

}
