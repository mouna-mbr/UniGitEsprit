package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.*;
import com.esprit.microservice.unigitesprit.entities.*;
import com.esprit.microservice.unigitesprit.enumeration.DemandeStatus;
import com.esprit.microservice.unigitesprit.enumeration.Role;
import com.esprit.microservice.unigitesprit.repository.DemandeParainageRepository;

import com.esprit.microservice.unigitesprit.repository.SujetRepository;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import com.esprit.microservice.unigitesprit.services.interfaces.DemandeParainageService;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class DemandeParainageServiceImpl implements DemandeParainageService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationService mailService;

    @Autowired
private DemandeParainageRepository repository;
    @Autowired
    private SujetRepository sujetRepository;
    @Autowired
    private DemandeParainageRepository demandeParainageRepository;

    private DemandeParainageDto toDto(DemandeParainage entity) {
        DemandeParainageDto demandes =new DemandeParainageDto();
        demandes.setId(entity.getId());
        demandes.setStatus(entity.getStatus());
        demandes.setUser(userToDto(entity.getUser()));
        if (entity.getEntreprise() != null) {
            demandes.setEntreprise(entrepriseToDto(entity.getEntreprise()));
        }

        demandes.setSujet(SujetToDto(entity.getSujet()));
        return demandes;
    }
    private SujetResponseDTO SujetToDto(Sujet entity){
        SujetResponseDTO dto = new SujetResponseDTO();
        dto.setId(entity.getId());
        dto.setDescription(entity.getDescription());
        dto.setTitre(entity.getTitre());
        dto.setProposeParId(entity.getProposePar().getId());
        return dto;
    }
    private EntrepriseDto entrepriseToDto(Entreprise entity){
        EntrepriseDto dto = new EntrepriseDto();
        dto.setAddress(entity.getAddress());
        dto.setEmail(entity.getEmail());
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPhone(entity.getPhoneNumber());
        return dto;
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
    private DemandeParainage toEntity(DemandeParainageDto dto) {
        List<DemandeParainage> demande = demandeParainageRepository.findBySujet_Id(dto.getSujet().getId());
        if (demande.isEmpty()) {
            DemandeParainage entity = new DemandeParainage();
            entity.setStatus(dto.getStatus());
            entity.setUser(userRepository.findById(dto.getUser().getId()).orElseThrow(() -> new EntityNotFoundException("user not found")));
            entity.setEntreprise(entity.getUser().getEntreprise());
            entity.setSujet(sujetRepository.findById(dto.getSujet().getId()).orElseThrow(() -> new EntityNotFoundException("Sujet not found")));
            return demandeParainageRepository.save(entity);
        }else{
        return null;}

    }
    public List<DemandeParainageDto> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<DemandeParainageDto> getDemandesByStatus(DemandeStatus status) {
        return repository.findByStatus(status)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public DemandeParainageDto createDemande(DemandeParainageDto dto) {
        DemandeParainage demande = toEntity(dto);
        if (demande != null) {
            demande.setStatus(DemandeStatus.PENDING);
            List<User> users = userRepository.findByRolesContaining(Role.ADMIN);
            for (User user : users) {
                try {
                    mailService.notifyDemandeParrainage(user.getEmail(), demande.getUser().getFirstName());
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                }
            }
            return toDto(demande);
        }
        return null;
    }

    public DemandeParainageDto updateStatus(Long id, String newStatus) {
        DemandeParainage demande = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande de parainage not found"));
        var oldStatus = demande.getStatus().toString();
        demande.setStatus(DemandeStatus.valueOf(newStatus));
            try {
                mailService.notifyChangementStatut(demande.getUser().getEmail(),demande.getUser().getFirstName(),demande.getSujet().getTitre(), oldStatus,newStatus);
            }catch (Exception e){
                System.out.println(e.getMessage());
            }

        return toDto(repository.save(demande));
    }

    public List<DemandeParainageDto> searchGroups(String query){
        List<DemandeParainage> groups  = repository.findBySearch(query);
        List<DemandeParainageDto> dtos = new ArrayList<>();
        for(var group:groups){
            dtos.add( toDto(group) );
        }
        return dtos;
    }
}
