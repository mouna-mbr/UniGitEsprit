package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.*;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.enumeration.Role;
import com.esprit.microservice.unigitesprit.repository.UserGroupRepository;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import com.esprit.microservice.unigitesprit.services.interfaces.UserService;
import com.opencsv.bean.CsvToBeanBuilder;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final Validator validator;
    private final PasswordEncoder passwordEncoder;
    private final GitService gitService;
    private final UserGroupRepository userGroupRepository;

    // ===================== ADD USER =====================
    @Override
    public UserResponseDTO addUser(UserCreateDTO dto) {
        validate(dto);
        checkUnique(dto.getIdentifiant(), dto.getEmail());
        User user = mapToUser(dto);
        return mapToResponse(userRepository.save(user));
    }

    // ===================== BULK ADD =====================
    @Override
    public List<UserResponseDTO> addUsersBulk(List<UserCreateDTO> dtos) {
        dtos.forEach(this::validate);
        dtos.forEach(dto -> checkUnique(dto.getIdentifiant(), dto.getEmail()));
        List<User> users = dtos.stream().map(this::mapToUser).toList();
        return userRepository.saveAll(users).stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ===================== CSV IMPORT =====================
    @Override
    public CsvImportReport addUsersFromCsv(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fichier vide");
        }

        List<UserCsvDTO> csvDtos;
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            csvDtos = new CsvToBeanBuilder<UserCsvDTO>(reader)
                    .withType(UserCsvDTO.class)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withSeparator(',')
                    .build()
                    .parse();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Impossible de lire le CSV : " + e.getMessage());
        }

        if (csvDtos.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CSV vide");
        }

        List<UserCreateDTO> validDtos = new ArrayList<>();
        List<CsvError> errors = new ArrayList<>();

        for (int i = 0; i < csvDtos.size(); i++) {
            UserCsvDTO csv = csvDtos.get(i);
            int line = i + 2; // +1 header, +1 index 0

            try {
                UserCreateDTO dto = csvToCreateDTO(csv);
                validate(dto);

                // Vérifier unicité (sans déclencher exception globale)
                if (userRepository.existsByIdentifiant(dto.getIdentifiant())) {
                    errors.add(new CsvError(line, "Identifiant existe déjà : " + dto.getIdentifiant()));
                    continue;
                }
                if (userRepository.existsByEmail(dto.getEmail())) {
                    errors.add(new CsvError(line, "Email existe déjà : " + dto.getEmail()));
                    continue;
                }

                validDtos.add(dto);
            } catch (IllegalArgumentException e) {
                errors.add(new CsvError(line, "Rôle invalide : " + e.getMessage()));
            } catch (ResponseStatusException e) {
                errors.add(new CsvError(line, e.getReason()));
            } catch (Exception e) {
                errors.add(new CsvError(line, "Erreur validation : " + e.getMessage()));
            }
        }

        // Sauvegarder les valides
        List<User> saved = userRepository.saveAll(validDtos.stream().map(this::mapToUser).toList());

        return new CsvImportReport(
                saved.size(),
                validDtos.size(),
                errors
        );
    }
    // ===================== LOGIN =====================
    @Override
    public UserResponseDTO login(UserLoginDTO dto) {
        User user = userRepository.findByIdentifiant(dto.getIdentifiant())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur non trouvé : " + dto.getIdentifiant()
                ));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe incorrect");
        }

        return mapToResponse(user);
    }

    // ===================== UPDATE GIT CREDENTIALS =====================
    @Override
    public UserResponseDTO updateGitCredentials(Long id, UserUpdateGitDTO dto) {
        if (!gitService.verifyGitHubCredentials(dto.getGitUsername(), dto.getGitAccessToken())) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Identifiants GitHub invalides");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur non trouvé : " + id
                ));

        user.setGitUsername(dto.getGitUsername());
        user.setGitAccessToken(dto.getGitAccessToken());

        return mapToResponse(userRepository.save(user));
    }

    // ===================== UPDATE USER =====================
    @Override
    public UserResponseDTO updateUser(String identifiant, UserUpdateDTO dto) {
        User user = userRepository.findByIdentifiant(identifiant)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur non trouvé : " + identifiant
                ));

        if (!user.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email déjà utilisé");
        }

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setRoles(new HashSet<>(dto.getRoles()));
        user.setClasse(dto.getClasse());
        user.setSpecialite(dto.getSpecialite());
        user.setGitUsername(dto.getGitUsername());
        user.setGitAccessToken(dto.getGitAccessToken());

        return mapToResponse(userRepository.save(user));
    }

    // ===================== DELETE USER =====================
    @Transactional
    @Override
    public void deleteUser(String identifiant) {
        User user = userRepository.findByIdentifiant(identifiant)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Utilisateur non trouvé : " + identifiant
                ));

        userGroupRepository.deleteByUserId(user.getId());
        userRepository.delete(user);
    }

    // ===================== GET ALL USERS =====================
    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ===================== PRIVATE HELPERS =====================

    private void validate(UserCreateDTO dto) {
        Set<ConstraintViolation<UserCreateDTO>> violations = validator.validate(dto);
        if (!violations.isEmpty()) {
            String errors = violations.stream()
                    .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                    .collect(Collectors.joining(", "));
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errors);
        }
    }

    private void checkUnique(String identifiant, String email) {
        if (userRepository.existsByIdentifiant(identifiant)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Identifiant existe déjà : " + identifiant);
        }
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email existe déjà : " + email);
        }
    }

    private User mapToUser(UserCreateDTO dto) {
        return new User(
                dto.getFirstName(),
                dto.getLastName(),
                new HashSet<>(dto.getRoles()),
                dto.getIdentifiant(),
                passwordEncoder.encode(dto.getPassword()),
                dto.getClasse(),
                dto.getSpecialite(),
                dto.getEmail(),
                dto.getGitUsername(),
                dto.getGitAccessToken()
        );
    }

    private UserCreateDTO csvToCreateDTO(UserCsvDTO csv) {
        UserCreateDTO dto = new UserCreateDTO();
        dto.setFirstName(csv.getFirstName());
        dto.setLastName(csv.getLastName());
        dto.setEmail(csv.getEmail());
        dto.setIdentifiant(csv.getIdentifiant());
        dto.setPassword(csv.getPassword());
        dto.setClasse(csv.getClasse());
        dto.setSpecialite(csv.getSpecialite());
        dto.setGitUsername(csv.getGitUsername());
        dto.setGitAccessToken(csv.getGitAccessToken());

        Set<Role> roles = Arrays.stream(csv.getRoles().split(";"))
                .map(String::trim)
                .filter(r -> !r.isEmpty())
                .map(r -> {
                    try {
                        return Role.valueOf(r.toUpperCase());
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("Rôle invalide : " + r);
                    }
                })
                .collect(Collectors.toSet());

        dto.setRoles(roles);
        return dto;
    }

    private UserResponseDTO mapToResponse(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setRole(user.getRoles());
        dto.setIdentifiant(user.getIdentifiant());
        dto.setClasse(user.getClasse());
        dto.setSpecialite(user.getSpecialite());
        dto.setEmail(user.getEmail());
        dto.setGitUsername(user.getGitUsername());
        dto.setGitAccessToken(user.getGitAccessToken());
        dto.setCreatedAt(user.getCreatedAt().toString());
        return dto;
    }

    private String extractLineNumber(Exception e) {
        String msg = e.getMessage();
        if (msg != null && msg.matches(".*line \\d+.*")) {
            return msg.replaceAll(".*line (\\d+).*", "$1");
        }
        return "?";
    }
}