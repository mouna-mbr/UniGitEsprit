package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.UserCreateDTO;
import com.esprit.microservice.unigitesprit.dto.UserLoginDTO;
import com.esprit.microservice.unigitesprit.dto.UserResponseDTO;
import com.esprit.microservice.unigitesprit.dto.UserUpdateGitDTO;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import com.esprit.microservice.unigitesprit.services.interfaces.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Validator validator;

    @Override
    public UserResponseDTO addUser(UserCreateDTO userCreateDTO) {
        validate(userCreateDTO);
        User user = mapToUser(userCreateDTO);
        User savedUser = userRepository.save(user);
        return mapToUserResponseDTO(savedUser);
    }

    @Override
    public List<UserResponseDTO> addUsersBulk(List<UserCreateDTO> userCreateDTOs) {
        userCreateDTOs.forEach(this::validate);
        List<User> users = userCreateDTOs.stream().map(this::mapToUser).collect(Collectors.toList());
        List<User> savedUsers = userRepository.saveAll(users);
        return savedUsers.stream().map(this::mapToUserResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<UserResponseDTO> addUsersFromCsv(MultipartFile file) {
        // Implementation for CSV parsing would go here (e.g., using OpenCSV or similar).
        // For simplicity, assuming it's handled elsewhere or not implemented yet.
        throw new UnsupportedOperationException("CSV import not implemented");
    }

    @Override
    public UserResponseDTO login(UserLoginDTO userLoginDTO) {
        User user = userRepository.findByIdentifiant(userLoginDTO.getIdentifiant())
                .orElseThrow(() -> new EntityNotFoundException("User not found with identifiant: " + userLoginDTO.getIdentifiant()));
        if (!user.getPassword().equals(userLoginDTO.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }
        return mapToUserResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateGitCredentials(Long id, UserUpdateGitDTO updateGitDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        user.setGitUsername(updateGitDTO.getGitUsername());
        user.setGitAccessToken(updateGitDTO.getGitAccessToken());
        User updatedUser = userRepository.save(user);
        return mapToUserResponseDTO(updatedUser);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponseDTO)
                .collect(Collectors.toList());
    }

    private void validate(UserCreateDTO userCreateDTO) {
        Set<ConstraintViolation<UserCreateDTO>> violations = validator.validate(userCreateDTO);
        if (!violations.isEmpty()) {
            throw new IllegalArgumentException("Validation errors: " + violations);
        }
    }

    private User mapToUser(UserCreateDTO dto) {
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setRole(dto.getRole());
        user.setIdentifiant(dto.getIdentifiant());
        user.setPassword(dto.getPassword());
        user.setClasse(dto.getClasse());
        user.setSpecialite(dto.getSpecialite());
        user.setEmail(dto.getEmail());
        user.setGitUsername(dto.getGitUsername());
        user.setGitAccessToken(dto.getGitAccessToken());
        return user;
    }

    private UserResponseDTO mapToUserResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRole());
        dto.setIdentifiant(user.getIdentifiant());
        dto.setClasse(user.getClasse());
        dto.setSpecialite(user.getSpecialite());
        dto.setEmail(user.getEmail());
        dto.setGitUsername(user.getGitUsername());
        dto.setGitAccessToken(user.getGitAccessToken());
        dto.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        return dto;
    }
}