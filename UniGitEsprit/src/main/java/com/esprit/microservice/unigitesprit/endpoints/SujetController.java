package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.DemandeBDPDTO;
import com.esprit.microservice.unigitesprit.dto.SujetCreateDTO;
import com.esprit.microservice.unigitesprit.dto.SujetResponseDTO;
import com.esprit.microservice.unigitesprit.services.interfaces.SujetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sujets")
public class SujetController {

    @Autowired
    private SujetService sujetService;

    @PostMapping
    public ResponseEntity<SujetResponseDTO> addSujet(@RequestBody SujetCreateDTO sujetCreateDTO, @RequestParam Long userId) {
        SujetResponseDTO response = sujetService.addSujet(sujetCreateDTO, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SujetResponseDTO>> getAllSujets() {
        return ResponseEntity.ok(sujetService.getAllSujets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SujetResponseDTO> getSujetById(@PathVariable Long id) {
        return ResponseEntity.ok(sujetService.getSujetById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SujetResponseDTO> updateSujet(@PathVariable Long id, @RequestBody SujetCreateDTO sujetCreateDTO) {
        return ResponseEntity.ok(sujetService.updateSujet(id, sujetCreateDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSujet(@PathVariable Long id) {
        sujetService.deleteSujet(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle-favorite")
    public ResponseEntity<SujetResponseDTO> toggleFavorite(@PathVariable Long id) {
        return ResponseEntity.ok(sujetService.toggleFavorite(id));
    }
    @GetMapping("/search")
    public ResponseEntity<List<SujetResponseDTO>> searchGroups(@RequestParam String query) {
        return ResponseEntity.ok(sujetService.searchSujet(query));
    }
}