package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.Classe;
import com.esprit.microservice.unigitesprit.entities.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClasseRepository extends JpaRepository<Classe, Long> {
    List<Classe> findByFavoriTrue();
    @Query("SELECT c FROM Classe c WHERE LOWER(c.nom) LIKE LOWER(CONCAT('%', :query, '%')) ")
    List<Classe> findBySearch(@Param("query") String query);

}