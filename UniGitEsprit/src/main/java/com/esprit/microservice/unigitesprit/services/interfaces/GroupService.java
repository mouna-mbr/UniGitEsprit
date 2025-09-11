package com.esprit.microservice.unigitesprit.services.interfaces;

import com.esprit.microservice.unigitesprit.dto.GroupCreateDTO;
import com.esprit.microservice.unigitesprit.dto.GroupResponseDTO;
import java.util.List;

public interface GroupService {
    GroupResponseDTO addGroup(GroupCreateDTO groupCreateDTO);
    List<GroupResponseDTO> getAllGroups();
    GroupResponseDTO getGroupById(Long id);
    GroupResponseDTO updateGroup(Long id, GroupCreateDTO groupCreateDTO);
    void deleteGroup(Long id);
    GroupResponseDTO toggleFavorite(Long id);
}