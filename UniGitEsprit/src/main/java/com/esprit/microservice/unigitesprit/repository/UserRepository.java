package com.esprit.microservice.unigitesprit.repository;


import com.esprit.microservice.unigitesprit.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByIdentifiant(String identifiant);
    Optional<User> findByEmail(String email);
    boolean existsByIdentifiant(String identifiant);
    boolean existsByEmail(String email);

}