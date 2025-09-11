package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.Pipeline;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PipelineRepository  extends JpaRepository<Pipeline, Long> {
    Optional<Pipeline> findByGroupId(Long groupId);
}
