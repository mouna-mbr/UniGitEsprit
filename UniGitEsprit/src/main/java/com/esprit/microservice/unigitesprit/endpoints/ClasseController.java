package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.ClasseCreateDTO;
import com.esprit.microservice.unigitesprit.dto.ClasseResponseDTO;
import com.esprit.microservice.unigitesprit.services.interfaces.ClasseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClasseController {

    @Autowired
    private ClasseService classeService;

    @PostMapping
    public ResponseEntity<ClasseResponseDTO> addClasse(@RequestBody ClasseCreateDTO classeCreateDTO) {
        ClasseResponseDTO response = classeService.addClasse(classeCreateDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ClasseResponseDTO>> getAllClasses() {
        return ResponseEntity.ok(classeService.getAllClasses());
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<ClasseResponseDTO>> getFavoriteClasses() {
        return ResponseEntity.ok(classeService.getFavoriteClasses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClasseResponseDTO> getClasseById(@PathVariable Long id) {
        return ResponseEntity.ok(classeService.getClasseById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClasseResponseDTO> updateClasse(@PathVariable Long id, @RequestBody ClasseCreateDTO classeCreateDTO) {
        return ResponseEntity.ok(classeService.updateClasse(id, classeCreateDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClasse(@PathVariable Long id) {
        classeService.deleteClasse(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle-favorite")
    public ResponseEntity<ClasseResponseDTO> toggleFavorite(@PathVariable Long id) {
        return ResponseEntity.ok(classeService.toggleFavorite(id));
    }
}