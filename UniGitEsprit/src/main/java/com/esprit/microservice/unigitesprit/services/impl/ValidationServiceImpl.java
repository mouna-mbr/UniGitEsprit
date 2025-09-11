package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.ValidationDTO;
import com.esprit.microservice.unigitesprit.entities.Etape;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.entities.Validation;
import com.esprit.microservice.unigitesprit.repository.EtapeRepository;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import com.esprit.microservice.unigitesprit.repository.ValidationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ValidationServiceImpl {
    @Autowired
    private ValidationRepository validationRepository;

    @Autowired
    private EtapeRepository etapeRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ValidationDTO> getValidationsByEtape(Long etapeId) {
        Etape etape = etapeRepository.findById(etapeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Etape does not exist"));
        return etape.getValidations().stream().map(validation -> {
            ValidationDTO dto = new ValidationDTO();
            dto.setId(validation.getId());
            dto.setDateValidation(validation.getDateValidation());
            dto.setRemarques(validation.getRemarques());
            dto.setEtapeId(validation.getEtape().getId());
            dto.setEtudiantIds(validation.getEtudiants().stream().map(User::getId).collect(Collectors.toList()));
            dto.setNote(validation.getNote());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<String> getRemarksByValidation(Long etapeId) {
        Validation validation = validationRepository.findById(etapeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Etape does not exist"));
        return validation.getRemarques().stream()
                .filter(remarque -> remarque != null && !remarque.trim().isEmpty())
                .collect(Collectors.toList());
    }

    public ValidationDTO createValidation(Long etapeId, ValidationDTO validationDTO) {
        Etape etape = etapeRepository.findById(etapeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Etape does not exist"));

        if (validationDTO.getRemarques() == null || validationDTO.getRemarques().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one remark is required");
        }
        if (validationDTO.getDateValidation() != null && !validationDTO.getDateValidation().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Validation date must be in the future");
        }
        if (validationDTO.getEtudiantIds() == null || validationDTO.getEtudiantIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one student is required");
        }

        Validation validation = new Validation();
        validation.setEtape(etape);
        validation.setDateValidation(validationDTO.getDateValidation() != null ? validationDTO.getDateValidation() : LocalDate.now());
        validation.setRemarques(validationDTO.getRemarques());
        validation.setNote(validationDTO.getNote());

        List<User> etudiants = userRepository.findAllById(validationDTO.getEtudiantIds());
        if (etudiants.size() != validationDTO.getEtudiantIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Some student IDs do not exist");
        }
        validation.setEtudiants(etudiants);

        validationRepository.save(validation);

        validationDTO.setId(validation.getId());
        return validationDTO;
    }

    public ValidationDTO updateValidation(Long validationId, ValidationDTO validationDTO) {
        Validation validation = validationRepository.findById(validationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Validation does not exist"));

        if (validationDTO.getRemarques() == null || validationDTO.getRemarques().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one remark is required");
        }
        if (validationDTO.getDateValidation() != null && !validationDTO.getDateValidation().isAfter(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Validation date must be in the future");
        }
        if (validationDTO.getEtudiantIds() == null || validationDTO.getEtudiantIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one student is required");
        }

        validation.setDateValidation(validationDTO.getDateValidation());
        validation.setRemarques(validationDTO.getRemarques());
        validation.setNote(validationDTO.getNote());

        List<User> etudiants = userRepository.findAllById(validationDTO.getEtudiantIds());
        if (etudiants.size() != validationDTO.getEtudiantIds().size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Some student IDs do not exist");
        }
        validation.setEtudiants(etudiants);

        validationRepository.save(validation);

        validationDTO.setId(validation.getId());
        return validationDTO;
    }

    public void deleteValidation(Long validationId) {
        if (!validationRepository.existsById(validationId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Validation does not exist");
        }
        validationRepository.deleteById(validationId);
    }
}
