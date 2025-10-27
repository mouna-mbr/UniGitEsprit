package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.Validation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ValidationRepository extends JpaRepository<Validation, Long> {
    @Query("SELECT AVG(v.note) FROM Validation v WHERE v.professor.identifiant = :profId")
    Double avgNoteByProf(String profId);

//    @Query("SELECT g.nom, AVG(v.note) as note FROM Validation v JOIN v.professor g WHERE g.enseignant.id = :profId GROUP BY g.nom ORDER BY note DESC LIMIT 3")
   //todo
    @Query("select DISTINCT note from Validation ")
    List<Object[]> top3GroupsByProf(String profId);

    @Query("SELECT CASE " +
            "WHEN v.note < 5 THEN '0-5' " +
            "WHEN v.note < 10 THEN '5-10' " +
            "WHEN v.note < 15 THEN '10-15' " +
            "ELSE '15-20' END, COUNT(v) " +
            "FROM Validation v WHERE v.professor.identifiant = :profId GROUP BY CASE " +
            "WHEN v.note < 5 THEN '0-5' " +
            "WHEN v.note < 10 THEN '5-10' " +
            "WHEN v.note < 15 THEN '10-15' " +
            "ELSE '15-20' END")
    List<Object[]> countNotesDistribution(String profId);
}
