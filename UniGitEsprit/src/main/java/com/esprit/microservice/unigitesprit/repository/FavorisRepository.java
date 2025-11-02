package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.Favoris;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavorisRepository extends JpaRepository<Favoris, Long> {
    Optional<Favoris> findByUserIdAndGroupId(Long userId, Long groupId);
    boolean existsByUserIdAndGroupId(Long userId, Long groupId);

    List<Favoris> findByUserId(Long userId);
    void deleteByUserIdAndGroupId(Long userId, Long groupId);
    List<Favoris> findByGroupId(Long groupId);
}
