package com.esprit.microservice.unigitesprit.services.interfaces;

import com.esprit.microservice.unigitesprit.dto.UserCreateDTO;
import com.esprit.microservice.unigitesprit.dto.UserLoginDTO;
import com.esprit.microservice.unigitesprit.dto.UserResponseDTO;
import com.esprit.microservice.unigitesprit.dto.UserUpdateGitDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    UserResponseDTO addUser(UserCreateDTO userCreateDTO);
    List<UserResponseDTO> addUsersBulk(List<UserCreateDTO> userCreateDTOs);
    List<UserResponseDTO> addUsersFromCsv(MultipartFile file);
    UserResponseDTO login(UserLoginDTO userLoginDTO);
    UserResponseDTO updateGitCredentials(Long id, UserUpdateGitDTO updateGitDTO);
    List<UserResponseDTO> getAllUsers();
}