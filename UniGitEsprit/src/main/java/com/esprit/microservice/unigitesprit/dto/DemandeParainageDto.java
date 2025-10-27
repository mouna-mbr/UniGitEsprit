package com.esprit.microservice.unigitesprit.dto;

import com.esprit.microservice.unigitesprit.enumeration.DemandeStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandeParainageDto {
    private Long id;
    private UserResponseDTO user;
    private EntrepriseDto entreprise;
    private SujetResponseDTO sujet;
    private DemandeStatus status;
}
