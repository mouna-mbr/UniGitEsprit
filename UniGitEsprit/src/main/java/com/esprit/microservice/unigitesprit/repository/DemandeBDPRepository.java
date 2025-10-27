package com.esprit.microservice.unigitesprit.repository;

import com.esprit.microservice.unigitesprit.entities.DemandeBDP;
import com.esprit.microservice.unigitesprit.enumeration.DemandeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DemandeBDPRepository extends JpaRepository<DemandeBDP,Long> {
    List<DemandeBDP> findByStatus(DemandeStatus status);
    @Query("""
    SELECT g 
    FROM DemandeBDP g 
    WHERE LOWER(g.group.nom) LIKE LOWER(CONCAT('%', :query, '%'))
       OR LOWER(g.status) LIKE LOWER(CONCAT('%', :query, '%'))
""")


    List<DemandeBDP> findBySearch(@Param("query") String query);

        @Query("SELECT u.specialite, COUNT(d) FROM DemandeBDP d JOIN d.user u GROUP BY u.specialite")
        List<Object[]> countBySpecialite();

        @Query("SELECT d.status, COUNT(d) FROM DemandeBDP d GROUP BY d.status")
        List<Object[]> countByStatus();

@Query("select count(*) from DemandeBDP ")
    Object getTotal();
}
