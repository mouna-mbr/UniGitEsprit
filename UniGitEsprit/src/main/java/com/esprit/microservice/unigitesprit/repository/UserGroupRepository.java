package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.UserGroup; // Define this entity if it exists
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {
    // Custom query methods can be added here if needed
}