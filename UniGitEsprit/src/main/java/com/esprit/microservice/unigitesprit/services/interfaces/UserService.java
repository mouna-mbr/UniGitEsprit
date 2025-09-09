package com.esprit.microservice.unigitesprit.services.interfaces;

import com.esprit.microservice.unigitesprit.dto.UserCreateDTO;
import com.esprit.microservice.unigitesprit.dto.UserLoginDTO;
import com.esprit.microservice.unigitesprit.dto.UserResponseDTO;
import com.esprit.microservice.unigitesprit.dto.UserUpdateGitDTO;
import com.esprit.microservice.unigitesprit.entities.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    UserResponseDTO addUser(UserCreateDTO userCreateDTO);
    List<UserResponseDTO> addUsersBulk(List<UserCreateDTO> userCreateDTOs);
    User findByIdentifiant(String identifiant);
    List<UserResponseDTO> addUsersFromCsv(MultipartFile file);
    UserResponseDTO login(UserLoginDTO userLoginDTO);
    UserResponseDTO updateGitCredentials(Long id, UserUpdateGitDTO updateGitDTO);
}