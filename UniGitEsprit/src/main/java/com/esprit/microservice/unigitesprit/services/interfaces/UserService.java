package com.esprit.microservice.unigitesprit.services.interfaces;

import com.esprit.microservice.unigitesprit.dto.*;
import com.esprit.microservice.unigitesprit.entities.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    UserResponseDTO addUser(UserCreateDTO userCreateDTO);
    List<UserResponseDTO> addUsersBulk(List<UserCreateDTO> userCreateDTOs);
    //boolean addUsersFromCsv(MultipartFile file);
    UserResponseDTO login(UserLoginDTO userLoginDTO);
    UserResponseDTO updateGitCredentials(Long id, UserUpdateGitDTO updateGitDTO);
    List<UserResponseDTO> getAllUsers();
    CsvImportReport addUsersFromCsv(MultipartFile file);  // Retourne un rapport
    UserResponseDTO updateUser(String identifiant, UserUpdateDTO updateDTO);
    void deleteUser(String id);
    //boolean deleteUser(String id);
}