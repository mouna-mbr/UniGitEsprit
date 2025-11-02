package com.esprit.microservice.unigitesprit.repository;


import com.esprit.microservice.unigitesprit.dto.EntrepriseDto;
import com.esprit.microservice.unigitesprit.entities.DemandeBDP;
import com.esprit.microservice.unigitesprit.entities.DemandeParainage;
import com.esprit.microservice.unigitesprit.entities.Entreprise;
import com.esprit.microservice.unigitesprit.enumeration.DemandeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DemandeParainageRepository extends JpaRepository<DemandeParainage, Long> {
    List<DemandeParainage> findByStatus(DemandeStatus status);

    @Query("""
                SELECT g 
                FROM DemandeParainage g 
                WHERE LOWER(g.sujet.titre) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.sujet.proposePar.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.sujet.proposePar.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.sujet.proposePar.email) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.status) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.entreprise.name) LIKE LOWER(CONCAT('%', :query, '%'))

            
            """)
    List<DemandeParainage> findBySearch(@Param("query") String query);

    List<DemandeParainage> findBySujet_Id(Long entrepriseId);
}
