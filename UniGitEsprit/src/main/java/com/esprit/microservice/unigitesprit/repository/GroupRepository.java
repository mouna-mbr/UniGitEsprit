package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    Set<Group> findBySujetId(Long sujetId);
    @Query("SELECT g FROM Group g WHERE LOWER(g.nom) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(g.classe.nom) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Group> findBySearch(@Param("query") String query);
    @Query("SELECT COUNT(g) FROM Group g WHERE g.enseignant.identifiant = :profId")
    long countByEnseignantId(@Param("profId") String profId);

    // Nombre de sujets différents encadrés par un prof
    @Query("SELECT COUNT(DISTINCT g.sujet.id) FROM Group g WHERE g.enseignant.identifiant = :profId")
    long countSujetsByProf(@Param("profId") String profId);

    // Sujets par nombre de groupes (uniquement pour ce prof)
    @Query("SELECT g.sujet.titre, COUNT(g) FROM Group g WHERE g.enseignant.identifiant = :profId GROUP BY g.sujet.titre")
    List<Object[]> countGroupsBySujet(@Param("profId") String profId);

    @Query("""
            SELECT  g
    FROM Group g
    JOIN g.users usergroup
    WHERE usergroup.user.id = :userId
    """)
    List<Group> findGroupsByUserId(@Param("userId") Long userId);

}