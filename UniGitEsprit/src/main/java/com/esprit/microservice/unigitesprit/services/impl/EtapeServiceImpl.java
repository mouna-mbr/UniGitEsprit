package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.EtapeDTO;
import com.esprit.microservice.unigitesprit.dto.UserResponseDTO;
import com.esprit.microservice.unigitesprit.entities.Etape;
import com.esprit.microservice.unigitesprit.entities.Group;
import com.esprit.microservice.unigitesprit.entities.Pipeline;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.entities.UserGroup;
import com.esprit.microservice.unigitesprit.enumeration.Role;
import com.esprit.microservice.unigitesprit.repository.EtapeRepository;
import com.esprit.microservice.unigitesprit.repository.PipelineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EtapeServiceImpl {
    @Autowired
    private EtapeRepository etapeRepository;

    @Autowired
    private PipelineRepository pipelineRepository;

    public List<UserResponseDTO> getStudentsByEtapeId(Long etapeId) {
        Etape etape = etapeRepository.findById(etapeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Etape not found"));
        Pipeline pipeline = etape.getPipeline();
        if (pipeline == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pipeline not found for Etape");
        }
        Group group = pipeline.getGroup();
        if (group == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Group not found for Pipeline");
        }
        return group.getUsers().stream()
                .map(UserGroup::getUser)
                .filter(user -> user.getRole() == Role.STUDENT)
                .map(user -> {
                    UserResponseDTO dto = new UserResponseDTO();
                    dto.setId(user.getId());
                    dto.setFirstName(user.getFirstName());
                    dto.setLastName(user.getLastName());
                    dto.setRole(user.getRole());
                    dto.setIdentifiant(user.getIdentifiant());
                    dto.setClasse(user.getClasse()); // Use String directly
                    dto.setSpecialite(user.getSpecialite());
                    dto.setEmail(user.getEmail());
                    dto.setGitUsername(user.getGitUsername());
                    dto.setGitAccessToken(user.getGitAccessToken());
                    dto.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Create or update an Etape
    public EtapeDTO saveEtape(EtapeDTO etapeDTO) {
        if (etapeDTO.getNom() == null || etapeDTO.getNom().trim().isEmpty()) {
            throw new IllegalArgumentException("Etape name cannot be null or empty");
        }
        if (etapeDTO.getPipelineId() == null) {
            throw new IllegalArgumentException("Pipeline ID cannot be null");
        }

        Pipeline pipeline = pipelineRepository.findById(etapeDTO.getPipelineId())
                .orElseThrow(() -> new IllegalArgumentException("Pipeline not found with ID: " + etapeDTO.getPipelineId()));

        Etape etape = etapeDTO.getId() == null ? new Etape() : etapeRepository.findById(etapeDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Etape not found with ID: " + etapeDTO.getId()));

        etape.setNom(etapeDTO.getNom());
        etape.setConsigne(etapeDTO.getConsigne());
        etape.setDeadline(etapeDTO.getDeadline());
        etape.setPipeline(pipeline);

        Etape savedEtape = etapeRepository.save(etape);
        return toDTO(savedEtape);
    }

    // Get Etape by ID
    public EtapeDTO getEtapeById(Long id) {
        Etape etape = etapeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Etape not found with ID: " + id));
        return toDTO(etape);
    }

    // Get all Etapes by Pipeline ID
    public List<EtapeDTO> getEtapesByPipelineId(Long pipelineId) {
        return etapeRepository.findByPipelineId(pipelineId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Delete Etape by ID
    public void deleteEtape(Long id) {
        if (!etapeRepository.existsById(id)) {
            throw new IllegalArgumentException("Etape not found with ID: " + id);
        }
        etapeRepository.deleteById(id);
    }

    // Convert Etape to EtapeDTO
    private EtapeDTO toDTO(Etape etape) {
        return new EtapeDTO(
                etape.getId(),
                etape.getNom(),
                etape.getConsigne(),
                etape.getDeadline(),
                etape.getPipeline().getId()
        );
    }
}