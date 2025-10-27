package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.UserCreateDTO;
import com.esprit.microservice.unigitesprit.dto.UserLoginDTO;
import com.esprit.microservice.unigitesprit.dto.UserResponseDTO;
import com.esprit.microservice.unigitesprit.dto.UserUpdateGitDTO;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.repository.ClasseUserRepository;
import com.esprit.microservice.unigitesprit.repository.UserGroupRepository;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import com.esprit.microservice.unigitesprit.services.interfaces.UserService;
import com.opencsv.bean.CsvToBeanBuilder;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ClasseUserRepository classeUserRepository;
    @Autowired
    private GitService gitService;
     @Autowired private UserGroupRepository userGroupRepository ;

    @Override
    public UserResponseDTO addUser(UserCreateDTO userCreateDTO) {
        validate(userCreateDTO);

        // Vérifier si l'identifiant ou l'email existe déjà
        if (userRepository.findByIdentifiant(userCreateDTO.getIdentifiant()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un utilisateur avec cet identifiant existe déjà.");
        }
        if (userRepository.findByEmail(userCreateDTO.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Un utilisateur avec cet email existe déjà.");
        }

        User user = mapToUser(userCreateDTO);
        User savedUser = userRepository.save(user);
        return mapToUserResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO updateUser(String id, User updatedUser) {
        Optional<User> optionalUser = userRepository.findByIdentifiant(id);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();

            // Vérifier si l'email est modifié et s'il est déjà utilisé par un autre utilisateur
            if (!existingUser.getEmail().equals(updatedUser.getEmail()) &&
                    userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Cet email est déjà utilisé par un autre utilisateur.");
            }

            existingUser.setFirstName(updatedUser.getFirstName());
            existingUser.setLastName(updatedUser.getLastName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setRole(updatedUser.getRole());
            existingUser.setIdentifiant(updatedUser.getIdentifiant());
            existingUser.setClasse(updatedUser.getClasse());
            existingUser.setSpecialite(updatedUser.getSpecialite());
            existingUser.setGitUsername(updatedUser.getGitUsername());
            existingUser.setGitAccessToken(updatedUser.getGitAccessToken());
            User savedUser = userRepository.save(existingUser);
            return mapToUserResponseDTO(savedUser);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé avec l'identifiant : " + id);
        }
    }

    @Override
    public List<UserResponseDTO> addUsersBulk(List<UserCreateDTO> userCreateDTOs) {
        userCreateDTOs.forEach(this::validate);
        for (UserCreateDTO dto : userCreateDTOs) {
            if (userRepository.findByIdentifiant(dto.getIdentifiant()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Un utilisateur avec l'identifiant " + dto.getIdentifiant() + " existe déjà.");
            }
            if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Un utilisateur avec l'email " + dto.getEmail() + " existe déjà.");
            }
        }
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

            for (User user : users) {
                // Vérifier si l'identifiant ou l'email existe déjà
                if (userRepository.findByIdentifiant(user.getIdentifiant()).isPresent()) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Un utilisateur avec l'identifiant " + user.getIdentifiant() + " existe déjà.");
                }
                if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Un utilisateur avec l'email " + user.getEmail() + " existe déjà.");
                }

                if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(user.getPassword()));
                }
                userRepository.save(user);
            }
            return true;
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erreur : " + e.getMessage());
        } catch (ResponseStatusException e) {
            throw e; // Propager l'erreur de conflit
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur lors du traitement du fichier CSV : " + e.getMessage(), e);
        }
    }

    @Override
    public UserResponseDTO login(UserLoginDTO userLoginDTO) {
        User user = userRepository.findByIdentifiant(userLoginDTO.getIdentifiant())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé avec l'identifiant : " + userLoginDTO.getIdentifiant()));
        if (!passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Mot de passe incorrect");
        }
        return mapToUserResponseDTO(user);
    }

    @Transactional
    @Override
    public void deleteUser(String identifiant) {
        User user = userRepository.findByIdentifiant(identifiant)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Supprimer les relations dans classe_user
        classeUserRepository.deleteByUserId(user.getId());

        // Supprimer les rôles/groupes liés
        userGroupRepository.deleteByUserId(user.getId());

        // Supprimer l'utilisateur
        userRepository.delete(user);
    }


    @Override
    public UserResponseDTO updateGitCredentials(Long id, UserUpdateGitDTO updateGitDTO) {
        boolean exists = gitService.verifyGitHubCredentials(updateGitDTO.getGitUsername(), updateGitDTO.getGitAccessToken());
        if (exists) {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé avec l'id : " + id));
            user.setGitUsername(updateGitDTO.getGitUsername());
            user.setGitAccessToken(updateGitDTO.getGitAccessToken());
            User updatedUser = userRepository.save(user);
            return mapToUserResponseDTO(updatedUser);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Les identifiants GitHub ne sont pas valides.");
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Erreurs de validation : " + violations);
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