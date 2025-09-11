package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.Etape;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EtapeRepository  extends JpaRepository<Etape, Long> {
    List<Etape> findByPipelineId(Long pipelineId);
}
