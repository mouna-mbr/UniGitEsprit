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
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Validator validator;

    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private GitService gitService;

    @Override
    public UserResponseDTO addUser(UserCreateDTO userCreateDTO) {
        validate(userCreateDTO);
        User user = mapToUser(userCreateDTO);
        User savedUser = userRepository.save(user);
        return mapToUserResponseDTO(savedUser);
    }

    public UserResponseDTO updateUser(String id, User updatedUser) {
        Optional<User> optionalUser = userRepository.findByIdentifiant(id);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setEmail(updatedUser.getEmail());
            System.out.println(updatedUser.getRole().toString());
            existingUser.setRole(updatedUser.getRole());
            existingUser.setIdentifiant(updatedUser.getIdentifiant());
            existingUser.setClasse(updatedUser.getClasse());
            existingUser.setSpecialite(updatedUser.getSpecialite());
            existingUser.setGitUsername(updatedUser.getGitUsername());
            existingUser.setGitAccessToken(updatedUser.getGitAccessToken());
            User savedUser = userRepository.save(existingUser);
            UserResponseDTO dto = mapToUserResponseDTO(savedUser);
            return dto;
        } else {
            return null;
        }

    }

    @Override
    public List<UserResponseDTO> addUsersBulk(List<UserCreateDTO> userCreateDTOs) {
        userCreateDTOs.forEach(this::validate);
        List<User> users = userCreateDTOs.stream().map(this::mapToUser).collect(Collectors.toList());
        List<User> savedUsers = userRepository.saveAll(users);
        return savedUsers.stream().map(this::mapToUserResponseDTO).collect(Collectors.toList());
    }

    @Override
    public boolean addUsersFromCsv(MultipartFile file) {

        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {

            List<User> users = new CsvToBeanBuilder<User>(reader)
                    .withType(User.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build()
                    .parse();

            if (users.isEmpty()) {
                throw new IllegalArgumentException("Le fichier CSV est vide !");
            }

            users.forEach(user -> {
                System.out.println(user.getFirstName());
                if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(user.getPassword()));
                }
                 User knownUser = userRepository.findByIdentifiant(user.getIdentifiant()).get();
                if (knownUser != null) {
                    knownUser.setRole(user.getRole());
                    knownUser.setClasse(user.getClasse());
                    knownUser.setSpecialite(user.getSpecialite());
                    knownUser.setGitUsername(user.getGitUsername());
                    knownUser.setGitAccessToken(user.getGitAccessToken());
                    knownUser.setGitAccessToken(knownUser.getGitAccessToken());
                    userRepository.save(knownUser);
                }else {
                userRepository.save(user);}
            });

            return true;

        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Erreur : " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du traitement du fichier CSV : " + e.getMessage(), e);
        }
    }


    @Override
    public UserResponseDTO login(UserLoginDTO userLoginDTO) {
        User user = userRepository.findByIdentifiant(userLoginDTO.getIdentifiant())
                .orElseThrow(() -> new EntityNotFoundException("User not found with identifiant: " + userLoginDTO.getIdentifiant()));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        if (!passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }
        return mapToUserResponseDTO(user);
    }
    @Override
    public boolean deleteUser(String identifiant) {
        Optional<User> userOpt = userRepository.findByIdentifiant(identifiant);
        if (userOpt.isPresent()) {
            userRepository.delete(userOpt.get());
            return true;
        }
        return false;
    }

    @Override
    public UserResponseDTO updateGitCredentials(Long id, UserUpdateGitDTO updateGitDTO) {
        boolean exists = gitService.verifyGitHubCredentials(updateGitDTO.getGitUsername(), updateGitDTO.getGitAccessToken());
        if (exists) {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
            user.setGitUsername(updateGitDTO.getGitUsername());
            user.setGitAccessToken(updateGitDTO.getGitAccessToken());
            User updatedUser = userRepository.save(user);
            return mapToUserResponseDTO(updatedUser);
        } else {
            return null;
        }
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
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
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