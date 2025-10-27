package com.esprit.microservice.unigitesprit.dto;

import com.esprit.microservice.unigitesprit.enumeration.DemandeStatus;

public class DemandeBDPDTO {
    private Long id;
    private UserResponseDTO user;
    private GroupResponseDTO group;
    private DemandeStatus status;

    public DemandeBDPDTO() {
    }

    public DemandeBDPDTO(Long id, UserResponseDTO user, GroupResponseDTO group, DemandeStatus status) {
        this.id = id;
        this.user = user;
        this.group = group;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponseDTO getUser() {
        return user;
    }

    public void setUser(UserResponseDTO user) {
        this.user = user;
    }

    public GroupResponseDTO getGroup() {
        return group;
    }

    public void setGroup(GroupResponseDTO group) {
        this.group = group;
    }

    public DemandeStatus getStatus() {
        return status;
    }

    public void setStatus(DemandeStatus status) {
        this.status = status;
    }
}
