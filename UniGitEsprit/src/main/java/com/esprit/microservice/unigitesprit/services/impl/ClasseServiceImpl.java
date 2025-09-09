package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.ClasseCreateDTO;
import com.esprit.microservice.unigitesprit.dto.ClasseResponseDTO;
import com.esprit.microservice.unigitesprit.entities.Classe;
import com.esprit.microservice.unigitesprit.entities.Sujet;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.repository.ClasseRepository;
//import com.esprit.microservice.unigitesprit.repository.SujetRepository;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import com.esprit.microservice.unigitesprit.services.interfaces.ClasseService;
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
public class ClasseServiceImpl implements ClasseService {

    @Autowired
    private ClasseRepository classeRepository;

    @Autowired
    private UserRepository userRepository;

   // @Autowired
   // private SujetRepository sujetRepository;

    @Autowired
    private Validator validator;

    @Override
    public ClasseResponseDTO addClasse(ClasseCreateDTO classeCreateDTO) {
        validate(classeCreateDTO);
        Classe classe = mapToClasse(classeCreateDTO);
        Classe savedClasse = classeRepository.save(classe);
        return mapToClasseResponseDTO(savedClasse);
    }

    @Override
    public List<ClasseResponseDTO> getAllClasses() {
        return classeRepository.findAll().stream()
                .map(this::mapToClasseResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ClasseResponseDTO> getFavoriteClasses() {
        return classeRepository.findByFavoriTrue().stream()
                .map(this::mapToClasseResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ClasseResponseDTO getClasseById(Long id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Classe not found with id: " + id));
        return mapToClasseResponseDTO(classe);
    }

    @Override
    public ClasseResponseDTO updateClasse(Long id, ClasseCreateDTO classeCreateDTO) {
        validate(classeCreateDTO);
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Classe not found with id: " + id));
        updateClasseFromDTO(classe, classeCreateDTO);
        Classe updatedClasse = classeRepository.save(classe);
        return mapToClasseResponseDTO(updatedClasse);
    }

    @Override
    public void deleteClasse(Long id) {
        if (!classeRepository.existsById(id)) {
            throw new EntityNotFoundException("Classe not found with id: " + id);
        }
        classeRepository.deleteById(id);
    }

    @Override
    public ClasseResponseDTO toggleFavorite(Long id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Classe not found with id: " + id));
        classe.setFavori(!classe.isFavori());
        Classe updatedClasse = classeRepository.save(classe);
        return mapToClasseResponseDTO(updatedClasse);
    }

    private void validate(ClasseCreateDTO classeCreateDTO) {
        Set<ConstraintViolation<ClasseCreateDTO>> violations = validator.validate(classeCreateDTO);
        if (!violations.isEmpty()) {
            throw new IllegalArgumentException("Validation errors: " + violations);
        }
    }

    private Classe mapToClasse(ClasseCreateDTO dto) {
        Classe classe = new Classe();
        classe.setNom(dto.getNom());
        classe.setAnneeUniversitaire(dto.getAnneeUniversitaire());
        classe.setLevel(dto.getLevel());
        classe.setOptionFormation(dto.getOptionFormation());
        classe.setFavori(false);

      //  if (dto.getSujetIds() != null) {
      //      List<Sujet> sujets = sujetRepository.findAllById(dto.getSujetIds());
      //      classe.setSujets(sujets);
       // }

        if (dto.getEtudiantIds() != null) {
            Set<User> etudiants = new HashSet<>(userRepository.findAllById(dto.getEtudiantIds()));
            classe.setEtudiants(etudiants);
        }

        if (dto.getEnseignantIds() != null) {
            Set<User> enseignants = new HashSet<>(userRepository.findAllById(dto.getEnseignantIds()));
            classe.setEnseignants(enseignants);
        }

        return classe;
    }

    private void updateClasseFromDTO(Classe classe, ClasseCreateDTO dto) {
        classe.setNom(dto.getNom());
        classe.setAnneeUniversitaire(dto.getAnneeUniversitaire());
        classe.setLevel(dto.getLevel());
        classe.setOptionFormation(dto.getOptionFormation());

      //  if (dto.getSujetIds() != null) {
       //     List<Sujet> sujets = sujetRepository.findAllById(dto.getSujetIds());
        //    classe.setSujets(sujets);
       // } else {
        //    classe.setSujets(null);
       // }

        if (dto.getEtudiantIds() != null) {
            Set<User> etudiants = new HashSet<>(userRepository.findAllById(dto.getEtudiantIds()));
            classe.setEtudiants(etudiants);
        } else {
            classe.setEtudiants(new HashSet<>());
        }

        if (dto.getEnseignantIds() != null) {
            Set<User> enseignants = new HashSet<>(userRepository.findAllById(dto.getEnseignantIds()));
            classe.setEnseignants(enseignants);
        } else {
            classe.setEnseignants(new HashSet<>());
        }
    }

    private ClasseResponseDTO mapToClasseResponseDTO(Classe classe) {
        ClasseResponseDTO dto = new ClasseResponseDTO();
        dto.setId(classe.getId());
        dto.setNom(classe.getNom());
        dto.setAnneeUniversitaire(classe.getAnneeUniversitaire());
        dto.setLevel(classe.getLevel());
        dto.setOptionFormation(classe.getOptionFormation());
        dto.setFavori(classe.isFavori());
        //dto.setSujetIds(classe.getSujets() != null ? classe.getSujets().stream().map(Sujet::getId).collect(Collectors.toList()) : null);
        dto.setEtudiantIds(classe.getEtudiants() != null ? classe.getEtudiants().stream().map(User::getId).collect(Collectors.toSet()) : null);
        dto.setEnseignantIds(classe.getEnseignants() != null ? classe.getEnseignants().stream().map(User::getId).collect(Collectors.toSet()) : null);
        return dto;
    }
}