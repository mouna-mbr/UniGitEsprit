package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.TacheDTO;
import com.esprit.microservice.unigitesprit.services.impl.TacheServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/api/etapes")
public class TacheController {
    @Autowired
    private TacheServiceImpl tacheService;

    @GetMapping("/{id}/taches")
    //@PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'STUDENT')")
    public ResponseEntity<List<TacheDTO>> getTaches(@PathVariable Long id) {
        try {
            List<TacheDTO> taches = tacheService.getTachesByEtape(id);
            return ResponseEntity.ok(taches);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("/{id}/taches")
   // @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'STUDENT')")
    public ResponseEntity<TacheDTO> createTache(@PathVariable Long id, @RequestBody TacheDTO tacheDTO) {
        try {
            TacheDTO createdTache = tacheService.createTache(id, tacheDTO);
            return ResponseEntity.ok(createdTache);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/taches/{id}")
   // @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'STUDENT')")
    public ResponseEntity<TacheDTO> updateTache(@PathVariable Long id, @RequestBody TacheDTO tacheDTO) {
        try {
            tacheDTO.setId(id);
            TacheDTO updatedTache = tacheService.updateTache(id, tacheDTO);
            return ResponseEntity.ok(updatedTache);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @PatchMapping("/tachesStatus/{id}")
    // @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'STUDENT')")
    public ResponseEntity<TacheDTO> updateTacheStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            TacheDTO updatedTache = tacheService.updateTacheStatus(id, status);
            return ResponseEntity.ok(updatedTache);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/taches/{id}")
   // @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'STUDENT')")
    public ResponseEntity<Void> deleteTache(@PathVariable Long id) {
        try {
            tacheService.deleteTache(id);
            return ResponseEntity.ok().build();
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
