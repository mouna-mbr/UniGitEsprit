package com.esprit.microservice.unigitesprit.services.interfaces;

import com.esprit.microservice.unigitesprit.dto.ClasseCreateDTO;
import com.esprit.microservice.unigitesprit.dto.ClasseResponseDTO;
import java.util.List;

public interface ClasseService {
    ClasseResponseDTO addClasse(ClasseCreateDTO classeCreateDTO);
    List<ClasseResponseDTO> getAllClasses();
    List<ClasseResponseDTO> getFavoriteClasses();
    ClasseResponseDTO getClasseById(Long id);
    ClasseResponseDTO updateClasse(Long id, ClasseCreateDTO classeCreateDTO);
    void deleteClasse(Long id);
    ClasseResponseDTO toggleFavorite(Long id);
}