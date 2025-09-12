package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.GroupCreateDTO;
import com.esprit.microservice.unigitesprit.dto.GroupResponseDTO;
import com.esprit.microservice.unigitesprit.dto.UserRoleDTO;
import com.esprit.microservice.unigitesprit.dto.UserRoleResponseDTO;
import com.esprit.microservice.unigitesprit.entities.*;
import com.esprit.microservice.unigitesprit.repository.*;
import com.esprit.microservice.unigitesprit.services.interfaces.GroupService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class GroupServiceImpl implements GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ClasseRepository classeRepository;

    @Autowired
    private SujetRepository sujetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Autowired
    private Validator validator;
    @Autowired
    private PipelineRepository pipelineRepository;
    public GroupResponseDTO getGroupByPipelineId(Long pipelineId) {
        Pipeline pipeline = pipelineRepository.findById(pipelineId)
                .orElseThrow(() -> new IllegalArgumentException("Pipeline not found with ID: " + pipelineId));
        Group group = pipeline.getGroup();
        if (group == null) {
            throw new IllegalArgumentException("No group associated with this pipeline");
        }
        GroupResponseDTO dto = new GroupResponseDTO();
        dto.setId(group.getId());
        dto.setNom(group.getNom());
        dto.setGitRepoUrl(group.getGitRepoUrl());
        dto.setGitRepoName(group.getGitRepoName());
        return dto;
    }

    @Override
    public GroupResponseDTO addGroup(GroupCreateDTO groupCreateDTO) {
        validate(groupCreateDTO);
        Group group = mapToGroup(groupCreateDTO);
        Group savedGroup = groupRepository.save(group);
        return mapToGroupResponseDTO(savedGroup);
    }

    @Override
    public List<GroupResponseDTO> getAllGroups() {
        return groupRepository.findAll().stream()
                .map(this::mapToGroupResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public GroupResponseDTO getGroupById(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Group not found with id: " + id));
        return mapToGroupResponseDTO(group);
    }

    @Override
    public GroupResponseDTO updateGroup(Long id, GroupCreateDTO groupCreateDTO) {
        validate(groupCreateDTO);
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Group not found with id: " + id));
        updateGroupFromDTO(group, groupCreateDTO);
        Group updatedGroup = groupRepository.save(group);
        return mapToGroupResponseDTO(updatedGroup);
    }

    @Override
    public void deleteGroup(Long id) {
        if (!groupRepository.existsById(id)) {
            throw new EntityNotFoundException("Group not found with id: " + id);
        }
        groupRepository.deleteById(id);
    }

    @Override
    public GroupResponseDTO toggleFavorite(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Group not found with id: " + id));
        group.setFavori(!group.isFavori());
        Group updatedGroup = groupRepository.save(group);
        return mapToGroupResponseDTO(updatedGroup);
    }

    private void validate(GroupCreateDTO groupCreateDTO) {
        Set<ConstraintViolation<GroupCreateDTO>> violations = validator.validate(groupCreateDTO);
        if (!violations.isEmpty()) {
            throw new IllegalArgumentException("Validation errors: " + violations);
        }
        // Custom validation: at least gitRepoUrl or gitRepoName must be provided
        if (groupCreateDTO.getGitRepoUrl() == null && groupCreateDTO.getGitRepoName() == null) {
            throw new IllegalArgumentException("Either Git Repo URL or Git Repo Name is required");
        }
    }

    private Group mapToGroup(GroupCreateDTO dto) {
        Group group = new Group();
        group.setNom(dto.getNom());
        group.setFavori(dto.isFavori());

        Classe classe = classeRepository.findById(dto.getClasseId())
                .orElseThrow(() -> new EntityNotFoundException("Classe not found with id: " + dto.getClasseId()));
        group.setClasse(classe);

        Sujet sujet = sujetRepository.findById(dto.getSujetId())
                .orElseThrow(() -> new EntityNotFoundException("Sujet not found with id: " + dto.getSujetId()));
        group.setSujet(sujet);

        User enseignant = userRepository.findById(dto.getEnseignantId())
                .orElseThrow(() -> new EntityNotFoundException("Enseignant not found with id: " + dto.getEnseignantId()));
        group.setEnseignant(enseignant);

        Set<UserGroup> userGroups = new HashSet<>();
        for (UserRoleDTO userRole : dto.getUsers()) {
            User user = userRepository.findById(userRole.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userRole.getUserId()));
            UserGroup userGroup = new UserGroup();
            userGroup.setGroup(group);
            userGroup.setUser(user);
            userGroup.setRole(userRole.getRole());
            userGroups.add(userGroup);
        }
        group.setUsers(userGroups);

        // Determine gitRepoName and gitRepoUrl
        String gitRepoName = dto.getGitRepoName();
        String gitRepoUrl = dto.getGitRepoUrl();
        if (gitRepoUrl != null && !gitRepoUrl.isEmpty()) {
            // Extract gitRepoName from gitRepoUrl (e.g., last segment)
            gitRepoName = gitRepoUrl.substring(gitRepoUrl.lastIndexOf('/') + 1);
        } else if (gitRepoName != null && !gitRepoName.isEmpty()) {
            // Use gitRepoName to create a new repo (placeholder)
            gitRepoUrl = createGitRepo(gitRepoName);
        } else {
            throw new IllegalArgumentException("Git repository information is invalid");
        }
        group.setGitRepoUrl(gitRepoUrl);
        group.setGitRepoName(gitRepoName);

        return group;
    }

    private void updateGroupFromDTO(Group group, GroupCreateDTO dto) {
        group.setNom(dto.getNom());
        group.setFavori(dto.isFavori());

        Classe classe = classeRepository.findById(dto.getClasseId())
                .orElseThrow(() -> new EntityNotFoundException("Classe not found with id: " + dto.getClasseId()));
        group.setClasse(classe);

        Sujet sujet = sujetRepository.findById(dto.getSujetId())
                .orElseThrow(() -> new EntityNotFoundException("Sujet not found with id: " + dto.getSujetId()));
        group.setSujet(sujet);

        User enseignant = userRepository.findById(dto.getEnseignantId())
                .orElseThrow(() -> new EntityNotFoundException("Enseignant not found with id: " + dto.getEnseignantId()));
        group.setEnseignant(enseignant);

        // Update users
        group.getUsers().clear();
        for (UserRoleDTO userRole : dto.getUsers()) {
            User user = userRepository.findById(userRole.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userRole.getUserId()));
            UserGroup userGroup = new UserGroup();
            userGroup.setGroup(group);
            userGroup.setUser(user);
            userGroup.setRole(userRole.getRole());
            group.getUsers().add(userGroup);
        }

        // Update Git repo if changed
        String newGitRepoName = dto.getGitRepoName();
        String newGitRepoUrl = dto.getGitRepoUrl();
        if (newGitRepoUrl != null && !newGitRepoUrl.equals(group.getGitRepoUrl())) {
            newGitRepoName = newGitRepoUrl.substring(newGitRepoUrl.lastIndexOf('/') + 1);
            group.setGitRepoUrl(newGitRepoUrl);
            group.setGitRepoName(newGitRepoName);
        } else if (newGitRepoName != null && !newGitRepoName.equals(group.getGitRepoName())) {
            newGitRepoUrl = createGitRepo(newGitRepoName);
            group.setGitRepoUrl(newGitRepoUrl);
            group.setGitRepoName(newGitRepoName);
        }
    }

    private String createGitRepo(String repoName) {
        // Placeholder for Git repository creation (e.g., using GitHub API)
        // Requires integration with a Git service using authenticated user's credentials
        return "https://github.com/username/" + repoName;
    }

    private GroupResponseDTO mapToGroupResponseDTO(Group group) {
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
}