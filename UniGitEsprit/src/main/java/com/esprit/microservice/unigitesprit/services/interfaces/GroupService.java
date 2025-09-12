package com.esprit.microservice.unigitesprit.services.interfaces;

import com.esprit.microservice.unigitesprit.dto.GroupCreateDTO;
import com.esprit.microservice.unigitesprit.dto.GroupResponseDTO;
import com.esprit.microservice.unigitesprit.dto.UserRoleResponseDTO;

import java.util.List;

public interface GroupService {
    GroupResponseDTO addGroup(GroupCreateDTO groupCreateDTO);
    List<GroupResponseDTO> getAllGroups();
    GroupResponseDTO getGroupById(Long id);
    GroupResponseDTO updateGroup(Long id, GroupCreateDTO groupCreateDTO);
    void deleteGroup(Long id);
    GroupResponseDTO toggleFavorite(Long id);
     GroupResponseDTO getGroupByPipelineId(Long pipelineId) ;
    GroupResponseDTO addMemberToGroup(Long groupId, UserRoleResponseDTO request);
    GroupResponseDTO removeMemberFromGroup(Long groupId, Long userId);
    GroupResponseDTO updateMemberRole(Long groupId, Long userId, String role);

    }