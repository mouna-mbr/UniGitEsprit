package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.DemandeParainage;
import com.esprit.microservice.unigitesprit.entities.Sujet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SujetRepository extends JpaRepository<Sujet, Long> {
    @Query("""
                SELECT g 
                FROM Sujet g 
                WHERE LOWER(g.titre) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.proposePar.firstName) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.proposePar.lastName) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.proposePar.email) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR LOWER(g.description) LIKE LOWER(CONCAT('%', :query, '%'))
                   OR cast(g.id as string ) LIKE LOWER(CONCAT('%', :query, '%'))

            
            """)
    List<Sujet> findBySearch(@Param("query") String query);

}