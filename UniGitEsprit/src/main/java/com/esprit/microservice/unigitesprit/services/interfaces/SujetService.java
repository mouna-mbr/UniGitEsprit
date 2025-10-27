package com.esprit.microservice.unigitesprit.services.interfaces;

import com.esprit.microservice.unigitesprit.dto.SujetCreateDTO;
import com.esprit.microservice.unigitesprit.dto.SujetResponseDTO;
import java.util.List;

public interface SujetService {
    SujetResponseDTO addSujet(SujetCreateDTO sujetCreateDTO, Long userId);
    List<SujetResponseDTO> getAllSujets();
    SujetResponseDTO getSujetById(Long id);
    SujetResponseDTO updateSujet(Long id, SujetCreateDTO sujetCreateDTO);
    void deleteSujet(Long id);
    SujetResponseDTO toggleFavorite(Long id);

    List<SujetResponseDTO> searchSujet(String query);
}