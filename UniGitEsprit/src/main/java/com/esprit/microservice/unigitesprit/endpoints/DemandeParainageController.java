package com.esprit.microservice.unigitesprit.endpoints;


import com.esprit.microservice.unigitesprit.dto.DemandeBDPDTO;
import com.esprit.microservice.unigitesprit.dto.DemandeParainageDto;
import com.esprit.microservice.unigitesprit.enumeration.DemandeStatus;
import com.esprit.microservice.unigitesprit.services.impl.DemandeParainageServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demandes-parainage")
@RequiredArgsConstructor
public class DemandeParainageController {
    private final DemandeParainageServiceImpl service;

    @GetMapping
    public ResponseEntity<List<DemandeParainageDto>> getDemandesByStatus(
            @RequestParam(required = false) DemandeStatus status) {

        List<DemandeParainageDto> demandes = (status != null)
                ? service.getDemandesByStatus(status)
                : service.getDemandesByStatus(DemandeStatus.PENDING);

        return ResponseEntity.ok(demandes);
    }
    @GetMapping("/search")
    public ResponseEntity<List<DemandeParainageDto>> searchGroups(@RequestParam String query) {
        return ResponseEntity.ok(service.searchGroups(query));
    }
    @PostMapping("/Add")
    public ResponseEntity<DemandeParainageDto> createDemande(@RequestBody DemandeParainageDto dto) {


        return ResponseEntity.ok(service.createDemande(dto));
    }
    @GetMapping("/all")
    public ResponseEntity<List<DemandeParainageDto>> getAllDemandes() {
        List<DemandeParainageDto> demandes = service.findAll();
        return ResponseEntity.ok(demandes);
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<DemandeParainageDto> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }
}
