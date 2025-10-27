package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.EtapeDTO;
import com.esprit.microservice.unigitesprit.dto.PipelineDTO;
import com.esprit.microservice.unigitesprit.entities.Etape;
import com.esprit.microservice.unigitesprit.entities.Group;
import com.esprit.microservice.unigitesprit.entities.Pipeline;
import com.esprit.microservice.unigitesprit.repository.EtapeRepository;
import com.esprit.microservice.unigitesprit.repository.GroupRepository;
import com.esprit.microservice.unigitesprit.repository.PipelineRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PipelineServiceImpl {
    @Autowired
    private PipelineRepository pipelineRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private EtapeRepository etapeRepository;

    public PipelineDTO addPipeline(PipelineDTO pipelineDTO) {
        Pipeline pipeline ;
        List<Etape> etapes;
        if (pipelineDTO.getNom() == null || pipelineDTO.getNom().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pipeline name cannot be empty");
        }

        Group group = groupRepository.findById(pipelineDTO.getGroupId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Group does not exist"));

        List<EtapeDTO> etapeDTOs = pipelineDTO.getEtapes();
        if (etapeDTOs == null || etapeDTOs.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pipeline must have at least one stage");
        }
        LocalDate currentDate = LocalDate.now();
        for (EtapeDTO etapeDTO : etapeDTOs) {
            if (etapeDTO.getNom() == null || etapeDTO.getNom().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stage name cannot be empty");
            }
            if (etapeDTO.getDeadline() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stage deadline cannot be null");
            }
            if (!etapeDTO.getDeadline().isAfter(currentDate)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stage deadline must be in the future: " + etapeDTO.getNom());
            }
        }
        Optional<Pipeline> pipelineiNdB= pipelineRepository.findByGroupId(group.getId());
        if (pipelineiNdB.isPresent()) {
            pipeline=pipelineiNdB.get();
            pipeline.setNom(pipelineDTO.getNom());
            pipeline.setGroup(group);

         etapes = etapeDTOs.stream().map(dto -> {
                Etape etape = new Etape();
                etape.setNom(dto.getNom());
                etape.setConsigne(dto.getConsigne());
                etape.setDeadline(dto.getDeadline());
                etape.setPipeline(pipeline);
                return etape;
            }).collect(Collectors.toList());
            pipeline.setEtapes(etapes);

        }else {
            pipeline = new Pipeline();
            pipeline.setNom(pipelineDTO.getNom());
            pipeline.setGroup(group);

             etapes = etapeDTOs.stream().map(dto -> {
                Etape etape = new Etape();
                etape.setNom(dto.getNom());
                etape.setConsigne(dto.getConsigne());
                etape.setDeadline(dto.getDeadline());
                etape.setPipeline(pipeline);
                return etape;
            }).collect(Collectors.toList());
            pipeline.setEtapes(etapes);

            pipelineRepository.save(pipeline);
        }
        pipelineDTO.setId(pipeline.getId());
        pipelineDTO.setEtapes(etapes.stream().map(etape -> {
            EtapeDTO dto = new EtapeDTO();
            dto.setId(etape.getId());
            dto.setNom(etape.getNom());
            dto.setConsigne(etape.getConsigne());
            dto.setDeadline(etape.getDeadline());
            return dto;
        }).collect(Collectors.toList()));

        return pipelineDTO;
    }
/****************edit pipeline******************/
    public PipelineDTO editPipeline(PipelineDTO pipelineDTO) {
        // Validate pipeline ID
        Pipeline pipeline = pipelineRepository.findById(pipelineDTO.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pipeline does not exist"));

        // Validate pipeline name
        if (pipelineDTO.getNom() == null || pipelineDTO.getNom().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pipeline name cannot be empty");
        }

        // Validate group ID
        Group group = groupRepository.findById(pipelineDTO.getGroupId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Group does not exist"));

        // Validate etapes and deadlines
        List<EtapeDTO> etapeDTOs = pipelineDTO.getEtapes();
        if (etapeDTOs == null || etapeDTOs.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pipeline must have at least one stage");
        }
        LocalDate currentDate = LocalDate.now();

        for (EtapeDTO etapeDTO : etapeDTOs) {
            if (etapeDTO.getNom() == null || etapeDTO.getNom().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stage name cannot be empty");
            }
            if (etapeDTO.getDeadline() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stage deadline cannot be null");
            }

        }

        // Update pipeline fields
        pipeline.setNom(pipelineDTO.getNom());
        pipeline.setGroup(group);

        List<Etape> existingEtapes = pipeline.getEtapes();

        List<Etape> updatedEtapes = etapeDTOs.stream().map(dto -> {
            Etape etape;

            if (dto.getId()!=null ) {
                etape=etapeRepository.findById(dto.getId()).orElse(null);
                etape.setNom(dto.getNom());
                etape.setConsigne(dto.getConsigne());
                etape.setDeadline(dto.getDeadline());
            } else {
                // Create new etape
                etape = new Etape();
                etape.setNom(dto.getNom());
                etape.setConsigne(dto.getConsigne());
                if (!dto.getDeadline().isAfter(currentDate)) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stage deadline must be in the future: " + dto.getNom());
                }
                etape.setDeadline(dto.getDeadline());
                etape.setPipeline(pipeline);
            }
            return etape;
        }).collect(Collectors.toList());

        // Remove etapes not in the updated list
        existingEtapes.removeIf(etape -> !updatedEtapes.contains(etape));
        existingEtapes.clear();
        existingEtapes.addAll(updatedEtapes);

        pipeline.setEtapes(updatedEtapes);
        pipelineRepository.save(pipeline);
        // Save updated pipeline

        // Update DTO with saved data
        pipelineDTO.setId(pipeline.getId());
        pipelineDTO.setEtapes(updatedEtapes.stream().map(etape -> {
            EtapeDTO dto = new EtapeDTO();
            dto.setId(etape.getId());
            dto.setNom(etape.getNom());
            dto.setConsigne(etape.getConsigne());
            dto.setDeadline(etape.getDeadline());
            return dto;
        }).collect(Collectors.toList()));

        return pipelineDTO;
    }

    /************************/
    public Optional<Pipeline> getById(Long id) {
        return pipelineRepository.findById(id);
    }

    public List<Pipeline> getAll() {
        return pipelineRepository.findAll();
    }



    public void delete(Long id) {
        pipelineRepository.deleteById(id);
    }

    public PipelineDTO getByGroupId(Long groupId) {
        // Fetch the pipeline by groupId (assuming there's a method for this)
        Pipeline pipeline = pipelineRepository.findByGroupId(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Pipeline not found for groupId: " + groupId));

        // Map Pipeline entity to DTO
        PipelineDTO dto = new PipelineDTO();
        dto.setId(pipeline.getId());
        dto.setNom(pipeline.getNom());
        dto.setGroupId(pipeline.getGroup().getId());

        // Convert Etape entities to EtapeDTO
        List<EtapeDTO> etapeDTOs = pipeline.getEtapes().stream().map(etape -> {
            EtapeDTO e = new EtapeDTO();
            e.setId(etape.getId());
            e.setNom(etape.getNom());
            e.setConsigne(etape.getConsigne());
            e.setDeadline(etape.getDeadline());
            return e;
        }).collect(Collectors.toList());

        dto.setEtapes(etapeDTOs);

        return dto;
    }
}
