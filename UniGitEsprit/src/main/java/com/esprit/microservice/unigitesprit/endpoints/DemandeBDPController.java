package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.ClasseResponseDTO;
import com.esprit.microservice.unigitesprit.dto.DemandeBDPDTO;
import com.esprit.microservice.unigitesprit.enumeration.DemandeStatus;
import com.esprit.microservice.unigitesprit.services.impl.DemandeBDPService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demandes-bdp")
@RequiredArgsConstructor
public class DemandeBDPController  {

    private final DemandeBDPService service;

    @GetMapping
    public ResponseEntity<List<DemandeBDPDTO>> getDemandesByStatus(
            @RequestParam(required = false) DemandeStatus status) {

        List<DemandeBDPDTO> demandes = (status != null)
                ? service.getDemandesByStatus(status)
                : service.getDemandesByStatus(DemandeStatus.PENDING);

        return ResponseEntity.ok(demandes);
    }

    @PostMapping("/Add")
    public ResponseEntity<DemandeBDPDTO> createDemande(@RequestBody DemandeBDPDTO dto) {


        return ResponseEntity.ok(service.createDemande(dto));
    }
    @GetMapping("/all")
    public ResponseEntity<List<DemandeBDPDTO>> getAllDemandes() {
        List<DemandeBDPDTO> demandes = service.findAll();
        return ResponseEntity.ok(demandes);
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<DemandeBDPDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam DemandeStatus status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }
    @GetMapping("/search")
    public ResponseEntity<List<DemandeBDPDTO>> searchGroups(@RequestParam String query) {
        return ResponseEntity.ok(service.searchGroups(query));
    }
}
