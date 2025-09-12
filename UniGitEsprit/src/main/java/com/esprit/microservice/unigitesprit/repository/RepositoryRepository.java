// RepositoryRepository.java
package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@org.springframework.stereotype.Repository
public interface RepositoryRepository extends JpaRepository<Repository, Long> {
    Optional<Repository> findByGithubRepoId(Long githubRepoId);
    Optional<Repository> findByUrl(String url);
    Optional<Repository> findByFullName(String fullName);
}