package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.*;
import com.esprit.microservice.unigitesprit.entities.Group;
import com.esprit.microservice.unigitesprit.entities.Sujet;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.enumeration.Role;
import com.esprit.microservice.unigitesprit.repository.GroupRepository;
import com.esprit.microservice.unigitesprit.repository.SujetRepository;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import com.esprit.microservice.unigitesprit.services.interfaces.SujetService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SujetServiceImpl implements SujetService {

    @Autowired
    private SujetRepository sujetRepository;

    @Autowired
    private UserRepository userRepository;
@Autowired
private NotificationService mailService;
    @Autowired
    private Validator validator;
    @Autowired
    private GroupRepository groupRepository;

    @Override
    public SujetResponseDTO addSujet(SujetCreateDTO sujetCreateDTO, Long userId) {
        validate(sujetCreateDTO);
        Sujet sujet = mapToSujet(sujetCreateDTO, userId);
        Sujet savedSujet = sujetRepository.save(sujet);
        List<User> users = userRepository.findByRolesContaining(Role.ADMIN);
        for (User user : users) {
            try {
                mailService.notifyNouveauSujet(user.getEmail(),sujet.getProposePar().getFirstName(),sujet.getTitre());
            }catch (Exception e){
                System.out.println(e.getMessage());
            }
        }
        return mapToSujetResponseDTO(savedSujet);
    }

    @Override
    public List<SujetResponseDTO> getAllSujets() {
        return sujetRepository.findAll().stream()
                .map(this::mapToSujetResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SujetResponseDTO getSujetById(Long id) {
        Sujet sujet = sujetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sujet not found with id: " + id));
        return mapToSujetResponseDTO(sujet);
    }

    @Override
    public SujetResponseDTO updateSujet(Long id, SujetCreateDTO sujetCreateDTO) {
        validate(sujetCreateDTO);
        Sujet sujet = sujetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sujet not found with id: " + id));
        updateSujetFromDTO(sujet, sujetCreateDTO);
        Sujet updatedSujet = sujetRepository.save(sujet);

        return mapToSujetResponseDTO(updatedSujet);
    }

    @Override
    public void deleteSujet(Long id) {
        if (!sujetRepository.existsById(id)) {
            throw new EntityNotFoundException("Sujet not found with id: " + id);
        }
        sujetRepository.deleteById(id);
    }

    @Override
    public SujetResponseDTO toggleFavorite(Long id) {
        Sujet sujet = sujetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sujet not found with id: " + id));
        sujet.setFavori(!sujet.isFavori());
        Sujet updatedSujet = sujetRepository.save(sujet);
        return mapToSujetResponseDTO(updatedSujet);
    }

    private void validate(SujetCreateDTO sujetCreateDTO) {
        Set<ConstraintViolation<SujetCreateDTO>> violations = validator.validate(sujetCreateDTO);
        if (!violations.isEmpty()) {
            throw new IllegalArgumentException("Validation errors: " + violations);
        }
    }

    private Sujet mapToSujet(SujetCreateDTO dto, Long userId) {
        Sujet sujet = new Sujet();
        sujet.setTitre(dto.getTitre());
        sujet.setDescription(dto.getDescription());
        sujet.setFavori(false);
        sujet.setTechnologies(dto.getTechnologies());
        User proposePar = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        sujet.setProposePar(proposePar);
        return sujet;
    }

    private void updateSujetFromDTO(Sujet sujet, SujetCreateDTO dto) {
        sujet.setTitre(dto.getTitre());
        sujet.setDescription(dto.getDescription());
    }

    private SujetResponseDTO mapToSujetResponseDTO(Sujet sujet) {
        Set<Group> groups = groupRepository.findBySujetId(sujet.getId());
        Set<GroupResponseDTO> groupDtos = groups.stream()
                .map(this::mapToGroupResponseDTO)
                .collect(Collectors.toSet());

        SujetResponseDTO dto = new SujetResponseDTO();
        dto.setId(sujet.getId());
        dto.setTitre(sujet.getTitre());
        dto.setFavori(sujet.isFavori());
        dto.setDescription(sujet.getDescription());
        dto.setTechnologies(sujet.getTechnologies());
        dto.setProposeParId(sujet.getProposePar().getId());
        dto.setGroups(groupDtos);
        return dto;
    }
    public  GroupResponseDTO mapToGroupResponseDTO(Group group) {
        GroupResponseDTO dto = new GroupResponseDTO();
        dto.setId(group.getId());
        dto.setNom(group.getNom());
        dto.setClasseId(group.getClasse().getId());
        dto.setSujetId(group.getSujet().getId());
        dto.setGitRepoUrl(group.getGitRepoUrl());
        dto.setGitRepoName(group.getGitRepoName());
        dto.setIsFavori(group.isFavori());
        dto.setEnseignantId(group.getEnseignant().getId());

        Set<UserRoleResponseDTO> userRoles = group.getUsers().stream()
                .map(userGroup -> {
                    UserRoleResponseDTO urDto = new UserRoleResponseDTO();
                    urDto.setUserId(userGroup.getUser().getId());
                    urDto.setRole(userGroup.getRole());
                    return urDto;
                })
                .collect(Collectors.toSet());
        dto.setUsers(userRoles);

        return dto;
    }
    @Override
    public List<SujetResponseDTO> searchSujet(String query){
        List<Sujet> groups  = sujetRepository.findBySearch(query);
        List<SujetResponseDTO> dtos = new ArrayList<>();
        for(var group:groups){
            dtos.add( mapToSujetResponseDTO(group) );
        }
        return dtos;
    }
}