package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.EtapeDTO;
import com.esprit.microservice.unigitesprit.dto.UserResponseDTO;
import com.esprit.microservice.unigitesprit.services.impl.EtapeServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/api/etapes")
public class EtapeController {
    private final EtapeServiceImpl etapeService;

    public EtapeController(EtapeServiceImpl etapeService) {
        this.etapeService = etapeService;
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<UserResponseDTO>> getStudentsByEtapeId(@PathVariable Long id) {
        List<UserResponseDTO> students = etapeService.getStudentsByEtapeId(id);
        return ResponseEntity.ok(students);
    }
    @PostMapping
    public ResponseEntity<EtapeDTO> createEtape(@RequestBody EtapeDTO etapeDTO) {
        EtapeDTO savedEtape = etapeService.saveEtape(etapeDTO);
        return ResponseEntity.ok(savedEtape);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtapeDTO> updateEtape(@PathVariable Long id, @RequestBody EtapeDTO etapeDTO) {
        etapeDTO.setId(id);
        EtapeDTO updatedEtape = etapeService.saveEtape(etapeDTO);
        return ResponseEntity.ok(updatedEtape);
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<EtapeDTO> getEtapeById(@PathVariable Long id) {
        EtapeDTO etapeDTO = etapeService.getEtapeById(id);
        return ResponseEntity.ok(etapeDTO);
    }

    @GetMapping("/pipeline/{pipelineId}")
    public ResponseEntity<List<EtapeDTO>> getEtapesByPipelineId(@PathVariable Long pipelineId) {
        List<EtapeDTO> etapes = etapeService.getEtapesByPipelineId(pipelineId);
        return ResponseEntity.ok(etapes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtape(@PathVariable Long id) {
        etapeService.deleteEtape(id);
        return ResponseEntity.noContent().build();
    }

}
