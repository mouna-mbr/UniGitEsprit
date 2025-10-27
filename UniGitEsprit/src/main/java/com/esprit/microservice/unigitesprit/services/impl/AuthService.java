package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.dto.AuthResponse;
import com.esprit.microservice.unigitesprit.dto.RegisterRequest;
import com.esprit.microservice.unigitesprit.dto.UserResponseDTO;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import com.esprit.microservice.unigitesprit.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    public AuthResponse login(String username, String password) {

        User user = userRepository.findByIdentifiant(username)
                .orElseThrow();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        String token = jwtUtil.generateToken(user.getIdentifiant(), user.getRole());
        UserResponseDTO responseDTO = mapToUserResponseDTO(user);
        return new AuthResponse(token,responseDTO );
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
