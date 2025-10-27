package com.esprit.microservice.unigitesprit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntrepriseDto {
    private Long id;
    private String name;
    private String address;
    private String email;
    private String phone;
}
