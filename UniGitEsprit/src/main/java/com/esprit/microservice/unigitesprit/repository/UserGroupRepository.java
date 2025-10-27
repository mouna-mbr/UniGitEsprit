package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.UserGroup; // Define this entity if it exists
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {
    @Modifying
    @Query("DELETE FROM UserGroup ug WHERE ug.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    // Custom query methods can be added here if needed
}