package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.GroupCreateDTO;
import com.esprit.microservice.unigitesprit.dto.GroupResponseDTO;
import com.esprit.microservice.unigitesprit.dto.UserRoleResponseDTO;
import com.esprit.microservice.unigitesprit.services.interfaces.GroupService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping
    public ResponseEntity<GroupResponseDTO> addGroup(@RequestBody GroupCreateDTO groupCreateDTO) {
        try {
            GroupResponseDTO response = groupService.addGroup(groupCreateDTO);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Return 400 with null body or custom error
        }
    }
    @GetMapping("/by-pipeline/{pipelineId}")
    public ResponseEntity<GroupResponseDTO> getGroupByPipelineId(@PathVariable Long pipelineId) {
        GroupResponseDTO group = groupService.getGroupByPipelineId(pipelineId);
        return ResponseEntity.ok(group);
    }
    @GetMapping("/search")
    public ResponseEntity<List<GroupResponseDTO>> searchGroups(@RequestParam String query) {
        return ResponseEntity.ok(groupService.searchGroups(query));
    }
    @GetMapping("/GroupsbyUser/{id}")
    public ResponseEntity<List<GroupResponseDTO>> getGroupsByUser(@PathVariable String id) {
        return ResponseEntity.ok(groupService.getGroupsByUser(id));
    }

    @GetMapping
    public ResponseEntity<List<GroupResponseDTO>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupResponseDTO> getGroupById(@PathVariable Long id) {
        return ResponseEntity.ok(groupService.getGroupById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupResponseDTO> updateGroup(@PathVariable Long id, @RequestBody GroupCreateDTO groupCreateDTO) {
        try {
            return ResponseEntity.ok(groupService.updateGroup(id, groupCreateDTO));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Return 400 with null body or custom error
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        try {
            groupService.deleteGroup(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/toggle-favorite/{userId}")
    public ResponseEntity<GroupResponseDTO> toggleFavorite(@PathVariable Long id ,@PathVariable Long userId) {
        return ResponseEntity.ok(groupService.toggleFavorite(userId,id));
    }
    // Ajouter un membre
    @PostMapping("/{groupId}/members")
    public ResponseEntity<GroupResponseDTO> addMemberToGroup(
            @PathVariable Long groupId,
            @RequestBody UserRoleResponseDTO request) {
        return ResponseEntity.ok(groupService.addMemberToGroup(groupId, request));
    }

    // Supprimer un membre
    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<GroupResponseDTO> removeMemberFromGroup(
            @PathVariable Long groupId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(groupService.removeMemberFromGroup(groupId, userId));
    }

    // Mettre à jour le rôle
    @PutMapping("/{groupId}/members/{userId}")
    public ResponseEntity<GroupResponseDTO> updateMemberRole(
            @PathVariable Long groupId,
            @PathVariable Long userId,
            @RequestBody String role) {
        return ResponseEntity.ok(groupService.updateMemberRole(groupId, userId, role));
    }

}