package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.ValidationDTO;
import com.esprit.microservice.unigitesprit.services.impl.ValidationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")

@RestController
@RequestMapping("/api/etapes")
public class ValidationController {

    @Autowired
    private ValidationServiceImpl validationService;

    @GetMapping("/{id}/validations")
    //@PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'STUDENT')")
    public ResponseEntity<List<ValidationDTO>> getValidations(@PathVariable Long id) {
        try {
            List<ValidationDTO> validations = validationService.getValidationsByEtape(id);
            return ResponseEntity.ok(validations);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/{id}/validations/remarks")
  //  @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'STUDENT')")
    public ResponseEntity<List<String>> getRemarksByValidation(@PathVariable Long id) {
        try {
            List<String> remarks = validationService.getRemarksByValidation(id);
            return ResponseEntity.ok(remarks);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("/{id}/validations")
   // @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'STUDENT')")
    public ResponseEntity<ValidationDTO> createValidation(@PathVariable Long id, @RequestBody ValidationDTO validationDTO) {
        try {
            validationDTO.setEtapeId(id);
            ValidationDTO createdValidation = validationService.createValidation(id, validationDTO);
            return ResponseEntity.ok(createdValidation);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PutMapping("/validations/{id}")
   // @PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'STUDENT')")
    public ResponseEntity<ValidationDTO> updateValidation(@PathVariable Long id, @RequestBody ValidationDTO validationDTO) {
        try {
            validationDTO.setId(id);
            ValidationDTO updatedValidation = validationService.updateValidation(id, validationDTO);
            return ResponseEntity.ok(updatedValidation);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/validations/{id}")
    //@PreAuthorize("hasAnyRole('ADMIN', 'PROFESSOR', 'STUDENT')")
    public ResponseEntity<Void> deleteValidation(@PathVariable Long id) {
        try {
            validationService.deleteValidation(id);
            return ResponseEntity.ok().build();
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
