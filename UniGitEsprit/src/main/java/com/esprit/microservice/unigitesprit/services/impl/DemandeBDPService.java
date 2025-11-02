package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.ClasseResponseDTO;
import com.esprit.microservice.unigitesprit.dto.DemandeBDPDTO;
import com.esprit.microservice.unigitesprit.dto.GroupResponseDTO;
import com.esprit.microservice.unigitesprit.dto.UserResponseDTO;
import com.esprit.microservice.unigitesprit.entities.Classe;
import com.esprit.microservice.unigitesprit.entities.DemandeBDP;
import com.esprit.microservice.unigitesprit.entities.Group;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.enumeration.DemandeStatus;
import com.esprit.microservice.unigitesprit.enumeration.Role;
import com.esprit.microservice.unigitesprit.repository.DemandeBDPRepository;
import com.esprit.microservice.unigitesprit.repository.GroupRepository;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.hibernate.internal.util.collections.CollectionHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DemandeBDPService {
    @Autowired
    private  DemandeBDPRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private NotificationService mailService;
    @Autowired
    private DemandeBDPRepository demandeBDPRepository;

    private DemandeBDPDTO toDto(DemandeBDP entity) {
        DemandeBDPDTO demandes =new DemandeBDPDTO();
        demandes.setId(entity.getId());
        demandes.setStatus(entity.getStatus());
        demandes.setUser(userToDto(entity.getUser()));
        demandes.setGroup(groupToDto(entity.getGroup()));
        return demandes;
    }
    private GroupResponseDTO groupToDto(Group entity){
        GroupResponseDTO dto= new GroupResponseDTO();
        dto.setId(entity.getId());
        dto.setNom(entity.getNom());
        dto.setClasseId(dto.getClasseId());
        dto.setEnseignantId(dto.getEnseignantId());
        return  dto;
    }
private UserResponseDTO userToDto(User entity){
        UserResponseDTO dto = new UserResponseDTO();
        dto.setClasse(entity.getClasse());
        dto.setEmail(entity.getEmail());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName((entity.getLastName()));
        dto.setIdentifiant(entity.getIdentifiant());
        return dto;
}
    private DemandeBDP toEntity(DemandeBDPDTO dto) {
        DemandeBDP entity = demandeBDPRepository.findByGroupId(dto.getGroup().getId());
        if(entity == null) {
             entity = new DemandeBDP();
            entity.setStatus(dto.getStatus());
            entity.setUser(userRepository.findById(dto.getUser().getId()).orElseThrow(() -> new EntityNotFoundException("user not found")));
            entity.setGroup(groupRepository.findById(dto.getGroup().getId()).orElseThrow(() -> new EntityNotFoundException("Group not found")));
            repository.save(entity);
        }
        return entity;
    }
    public List<DemandeBDPDTO> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<DemandeBDPDTO> getDemandesByStatus(DemandeStatus status) {
        return repository.findByStatus(status)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public DemandeBDPDTO createDemande(DemandeBDPDTO dto) {
        DemandeBDP demande = toEntity(dto);
        demande.setStatus(DemandeStatus.PENDING);
        List<User> users = userRepository.findByRolesContaining(Role.ADMIN);
        for (User user : users) {
            try {
                mailService.notifyDemandeBDP(user.getEmail(),demande.getUser().getFirstName());
            }catch (Exception e){
                System.out.println(e.getMessage());
            }
        }
        return toDto(demande);
    }

    public DemandeBDPDTO updateStatus(Long id, DemandeStatus newStatus) {
        DemandeBDP demande = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("DemandeBDP not found"));
        var oldStatus = demande.getStatus().toString();
        demande.setStatus(newStatus);
        try {
            mailService.notifyChangementStatut(demande.getUser().getEmail(),demande.getUser().getFirstName(),demande.getGroup().getNom(), oldStatus,newStatus.toString());
        }catch (Exception e){
            System.out.println(e.getMessage());
        }

        return toDto(repository.save(demande));
    }

    public List<DemandeBDPDTO> searchGroups(String query){
        List<DemandeBDP> groups  = repository.findBySearch(query);
        List<DemandeBDPDTO> dtos = new ArrayList<>();
        for(var group:groups){
            dtos.add( toDto(group) );
        }
        return dtos;
    }
}
