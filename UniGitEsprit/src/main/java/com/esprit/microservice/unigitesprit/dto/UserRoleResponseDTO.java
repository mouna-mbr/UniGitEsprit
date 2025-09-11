package com.esprit.microservice.unigitesprit.dto;

import lombok.Data;

@Data
public class UserRoleResponseDTO {
    private Long userId;
    private String role;
}