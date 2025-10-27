package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.Etape;
import com.esprit.microservice.unigitesprit.entities.Tache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TacheRepository extends JpaRepository<Tache, Long> {
    List<Tache> findByEtape(Etape etape);
    @Query("SELECT g.nom, t.status, COUNT(t) " +
            "FROM Tache t " +
            "JOIN t.etape e " +
            "JOIN e.pipeline.group g " +
            " where g.enseignant.identifiant  = :profId GROUP BY g.nom, t.status")
    List<Object[]> countByStatusAndProf(@Param("profId") String profId);
}