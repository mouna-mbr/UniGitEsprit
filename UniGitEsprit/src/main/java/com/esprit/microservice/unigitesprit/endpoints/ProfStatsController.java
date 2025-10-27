package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.repository.GroupRepository;
import com.esprit.microservice.unigitesprit.repository.TacheRepository;
import com.esprit.microservice.unigitesprit.repository.ValidationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/prof/stats")
@RequiredArgsConstructor
public class ProfStatsController {

    private final GroupRepository groupRepo;
    private final ValidationRepository validationRepo;
    private final TacheRepository tacheRepo;

    @GetMapping("/{profId}")
    public Map<String, Object> getProfStats(@PathVariable String profId) {
        Map<String, Object> res = new HashMap<>();

        // KPI
        res.put("totalGroups", groupRepo.countByEnseignantId(profId));
        res.put("totalSujets", groupRepo.countSujetsByProf(profId));
        res.put("avgNote", validationRepo.avgNoteByProf(profId));

        // Sujets par nombre de groupes
        res.put("sujetsByGroupCount", groupRepo.countGroupsBySujet(profId));

        // Top 3 groupes par note
        res.put("top3Groups", validationRepo.top3GroupsByProf(profId));

        // Tâches par statut
        res.put("tasksByStatus", tacheRepo.countByStatusAndProf(profId));

        // Distribution des notes
        res.put("notesDistribution", validationRepo.countNotesDistribution(profId));

        return res;
    }
}

