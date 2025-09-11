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
    public ResponseEntity<List<ValidationDTO>> getValidations(@PathVariable Long id) {
        try {
            List<ValidationDTO> validations = validationService.getValidationsByEtape(id);
            return ResponseEntity.ok(validations);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @GetMapping("/{id}/validations/remarks")
    public ResponseEntity<List<String>> getRemarksByValidation(@PathVariable Long id) {
        try {
            List<String> remarks = validationService.getRemarksByValidation(id);
            return ResponseEntity.ok(remarks);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @PostMapping("/{id}/validations")
    public ResponseEntity<ValidationDTO> createValidation(@PathVariable Long id, @RequestBody ValidationDTO validationDTO) {
        try {
            ValidationDTO createdValidation = validationService.createValidation(id, validationDTO);
            return ResponseEntity.ok(createdValidation);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @PutMapping("/validations/{id}")
    public ResponseEntity<ValidationDTO> updateValidation(@PathVariable Long id, @RequestBody ValidationDTO validationDTO) {
        try {
            validationDTO.setId(id);
            ValidationDTO updatedValidation = validationService.updateValidation(id, validationDTO);
            return ResponseEntity.ok(updatedValidation);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @DeleteMapping("/validations/{id}")
    public ResponseEntity<Void> deleteValidation(@PathVariable Long id) {
        try {
            validationService.deleteValidation(id);
            return ResponseEntity.ok().build();
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        }
    }

    // New endpoint: Add a remark to a validation
    @PostMapping("/validations/{id}/remarks")
    public ResponseEntity<ValidationDTO> addRemark(@PathVariable Long id, @RequestBody String remark) {
        try {
            ValidationDTO updatedValidation = validationService.addRemarkToValidation(id, remark);
            return ResponseEntity.ok(updatedValidation);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    // New endpoint: Update a specific remark in a validation
    @PutMapping("/validations/{id}/remarks/{remarkIndex}")
    public ResponseEntity<ValidationDTO> updateRemark(@PathVariable Long id, @PathVariable int remarkIndex, @RequestBody String updatedRemark) {
        try {
            ValidationDTO updatedValidation = validationService.updateRemarkInValidation(id, remarkIndex, updatedRemark);
            return ResponseEntity.ok(updatedValidation);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    // New endpoint: Delete a specific remark from a validation
    @DeleteMapping("/validations/{id}/remarks/{remarkIndex}")
    public ResponseEntity<ValidationDTO> deleteRemark(@PathVariable Long id, @PathVariable int remarkIndex) {
        try {
            ValidationDTO updatedValidation = validationService.deleteRemarkFromValidation(id, remarkIndex);
            return ResponseEntity.ok(updatedValidation);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }
}