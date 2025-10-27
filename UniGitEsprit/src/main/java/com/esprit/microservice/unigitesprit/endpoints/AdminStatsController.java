package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.repository.DemandeBDPRepository;
import com.esprit.microservice.unigitesprit.repository.DemandeParrainageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final DemandeBDPRepository demandeBdpRepo;
    @Autowired
    private final DemandeParrainageRepository demandeParrainageRepo;

    @GetMapping
    public Map<String, Object> getAdminStats() {
        Map<String, Object> res = new HashMap<>();

        // KPI
        res.put("totalDemandeBdp", demandeBdpRepo.getTotal());
        res.put("totalDemandeParrainage", demandeParrainageRepo.count());

        // Demande BDP par spécialité
        res.put("bdpBySpecialite", demandeBdpRepo.countBySpecialite());

        // Demande BDP par statut
        res.put("bdpByStatus", demandeBdpRepo.countByStatus());

        // Demande Parrainage par statut
        res.put("parrainageByStatus", demandeParrainageRepo.countByStatus());

        // Demande Parrainage par sujet
        res.put("parrainageBySujet", demandeParrainageRepo.countBySujet());

        return res;
    }
}