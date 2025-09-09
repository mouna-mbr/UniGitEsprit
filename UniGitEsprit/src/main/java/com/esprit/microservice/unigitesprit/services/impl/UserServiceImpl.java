package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.UserCreateDTO;
import com.esprit.microservice.unigitesprit.dto.UserLoginDTO;
import com.esprit.microservice.unigitesprit.dto.UserResponseDTO;
import com.esprit.microservice.unigitesprit.dto.UserUpdateGitDTO;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import com.esprit.microservice.unigitesprit.services.interfaces.UserService;
import com.opencsv.bean.CsvToBeanBuilder;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private Validator validator;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public UserResponseDTO addUser(UserCreateDTO userCreateDTO) {
        Set<ConstraintViolation<UserCreateDTO>> violations = validator.validate(userCreateDTO);
        if (!violations.isEmpty()) {
            throw new IllegalArgumentException("Validation errors: " + violations);
        }

        if (userRepository.existsByIdentifiant(userCreateDTO.getIdentifiant())) {
            throw new IllegalArgumentException("Identifiant already exists: " + userCreateDTO.getIdentifiant());
        }
        if (userRepository.existsByEmail(userCreateDTO.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + userCreateDTO.getEmail());
        }

        String encodedPassword = passwordEncoder.encode(userCreateDTO.getPassword());

        User user = new User(
                userCreateDTO.getFirstName(),
                userCreateDTO.getLastName(),
                userCreateDTO.getRole(),
                userCreateDTO.getIdentifiant(),
                encodedPassword,
                userCreateDTO.getClasse(),
                userCreateDTO.getSpecialite(),
                userCreateDTO.getEmail(),
                userCreateDTO.getGitUsername(),
                userCreateDTO.getGitAccessToken()
        );

        User savedUser = userRepository.save(user);
        return mapToUserResponseDTO(savedUser);
    }

    @Override
    public User findByIdentifiant(String identifiant) {
        return userRepository.findByIdentifiant(identifiant)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    public List<UserResponseDTO> addUsersBulk(List<UserCreateDTO> userCreateDTOs) {
        List<UserResponseDTO> responses = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        for (int i = 0; i < userCreateDTOs.size(); i++) {
            UserCreateDTO userCreateDTO = userCreateDTOs.get(i);
            try {
                Set<ConstraintViolation<UserCreateDTO>> violations = validator.validate(userCreateDTO);
                if (!violations.isEmpty()) {
                    errors.add("Row " + (i + 2) + ": Validation errors: " + violations);
                    continue;
                }

                UserResponseDTO response = addUser(userCreateDTO);
                responses.add(response);
            } catch (IllegalArgumentException e) {
                errors.add("Row " + (i + 2) + ": " + e.getMessage());
            }
        }

        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Bulk upload errors: " + String.join("; ", errors));
        }

        return responses;
    }

    @Override
    public List<UserResponseDTO> addUsersFromCsv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("CSV file is empty or not provided");
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            List<UserCreateDTO> userCreateDTOs = new CsvToBeanBuilder<UserCreateDTO>(reader)
                    .withType(UserCreateDTO.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withSkipLines(0)
                    .build()
                    .parse();

            return addUsersBulk(userCreateDTOs);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to parse CSV file: " + e.getMessage());
        }
    }

    @Override
    public UserResponseDTO login(UserLoginDTO userLoginDTO) {
        User user = userRepository.findByIdentifiant(userLoginDTO.getIdentifiant())
                .orElseThrow(() -> new EntityNotFoundException("User not found with identifiant: " + userLoginDTO.getIdentifiant()));

        if (!passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        return mapToUserResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateGitCredentials(Long id, UserUpdateGitDTO updateGitDTO) {
        // Verify GitHub credentials
        boolean isValid = verifyGitHubCredentials(updateGitDTO.getGitUsername(), updateGitDTO.getGitAccessToken());
        if (!isValid) {
            throw new IllegalArgumentException("Invalid GitHub credentials");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        user.setGitUsername(updateGitDTO.getGitUsername());
        user.setGitAccessToken(updateGitDTO.getGitAccessToken());

        User updatedUser = userRepository.save(user);
        return mapToUserResponseDTO(updatedUser);
    }

    private boolean verifyGitHubCredentials(String gitUsername, String gitAccessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + gitAccessToken);
            headers.set("Accept", "application/vnd.github.v3+json");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.github.com/users/" + gitUsername,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    private UserResponseDTO mapToUserResponseDTO(User user) {
        UserResponseDTO response = new UserResponseDTO();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setIdentifiant(user.getIdentifiant());
        response.setClasse(user.getClasse());
        response.setSpecialite(user.getSpecialite());
        response.setGitUsername(user.getGitUsername());
        response.setGitAccessToken(user.getGitAccessToken());
        response.setCreatedAt(user.getCreatedAt().toString());
        return response;
    }
}