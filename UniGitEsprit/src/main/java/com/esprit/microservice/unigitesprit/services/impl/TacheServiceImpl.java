package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.TacheDTO;
import com.esprit.microservice.unigitesprit.entities.Etape;
import com.esprit.microservice.unigitesprit.entities.Tache;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.enumeration.Status;
import com.esprit.microservice.unigitesprit.repository.EtapeRepository;
import com.esprit.microservice.unigitesprit.repository.TacheRepository;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TacheServiceImpl {

    @Autowired
    private TacheRepository tacheRepository;

    @Autowired
    private EtapeRepository etapeRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TacheDTO> getTachesByEtape(Long etapeId) {
        Etape etape = etapeRepository.findById(etapeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Etape not found with ID: " + etapeId));

        return tacheRepository.findByEtape(etape).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TacheDTO createTache(Long etapeId, TacheDTO tacheDTO) {
        Etape etape = etapeRepository.findById(etapeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Etape not found with ID: " + etapeId));

        // Validate assigneeId
        if (tacheDTO.getAssigneeId() != null) {
            userRepository.findById(tacheDTO.getAssigneeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found with ID: " + tacheDTO.getAssigneeId()));
        }

        Tache tache = new Tache();
        tache.setNom(tacheDTO.getNom());
        tache.setDescription(tacheDTO.getDescription());
        tache.setStatus(tacheDTO.getStatus());
        tache.setDeadline(tacheDTO.getDeadline());
        tache.setAssigneeId(tacheDTO.getAssigneeId());
        tache.setEtape(etape);

        Tache savedTache = tacheRepository.save(tache);
        return toDTO(savedTache);
    }

    public TacheDTO updateTache(Long id, TacheDTO tacheDTO) {
        Tache tache = tacheRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tache not found with ID: " + id));

        // Validate assigneeId
        if (tacheDTO.getAssigneeId() != null) {
            userRepository.findById(tacheDTO.getAssigneeId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found with ID: " + tacheDTO.getAssigneeId()));
        }

        tache.setNom(tacheDTO.getNom());
        tache.setDescription(tacheDTO.getDescription());
        tache.setStatus(tacheDTO.getStatus());
        tache.setDeadline(tacheDTO.getDeadline());
        tache.setAssigneeId(tacheDTO.getAssigneeId());

        Tache updatedTache = tacheRepository.save(tache);
        return toDTO(updatedTache);
    }

    public TacheDTO updateTacheStatus(Long id, String status) {
        Tache tache = tacheRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tache not found with ID: " + id));

        try {
            tache.setStatus(Status.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + status);
        }

        Tache updatedTache = tacheRepository.save(tache);
        return toDTO(updatedTache);
    }

    public void deleteTache(Long id) {
        Tache tache = tacheRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tache not found with ID: " + id));
        tacheRepository.delete(tache);
    }

    private TacheDTO toDTO(Tache tache) {
        TacheDTO dto = new TacheDTO();
        dto.setId(tache.getId());
        dto.setNom(tache.getNom());
        dto.setDescription(tache.getDescription());
        dto.setStatus(tache.getStatus());
        dto.setDeadline(tache.getDeadline());
        dto.setAssigneeId(tache.getAssigneeId());

        // Populate assigneeName
        if (tache.getAssigneeId() != null) {
            Optional<User> user = userRepository.findById(tache.getAssigneeId());
            dto.setAssigneeName(user.map(u -> u.getFirstName() + " " + u.getLastName()).orElse("Unknown"));
        } else {
            dto.setAssigneeName("Unassigned");
        }

        return dto;
    }
}