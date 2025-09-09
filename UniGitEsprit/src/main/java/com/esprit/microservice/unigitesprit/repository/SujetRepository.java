package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.Sujet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SujetRepository extends JpaRepository<Sujet, Long> {
}