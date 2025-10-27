package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.ClasseUser;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClasseUserRepository extends JpaRepository<ClasseUser, Long> {
    @Transactional
    void deleteByUserId(Long userId);
}

