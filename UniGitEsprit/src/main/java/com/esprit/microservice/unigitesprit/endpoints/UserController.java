package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.UserCreateDTO;
import com.esprit.microservice.unigitesprit.dto.UserLoginDTO;
import com.esprit.microservice.unigitesprit.dto.UserResponseDTO;
import com.esprit.microservice.unigitesprit.dto.UserUpdateGitDTO;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.services.interfaces.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> responses = userService.getAllUsers();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable String id, @RequestBody User user) {
        try {
            UserResponseDTO response = userService.updateUser(id, user);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(null, e.getStatusCode());
        }
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> addUser(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        try {
            UserResponseDTO response = userService.addUser(userCreateDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(null, e.getStatusCode());
        }
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<UserResponseDTO>> addUsersBulk(@Valid @RequestBody List<UserCreateDTO> userCreateDTOs) {
        try {
            List<UserResponseDTO> responses = userService.addUsersBulk(userCreateDTOs);
            return new ResponseEntity<>(responses, HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(null, e.getStatusCode());
        }
    }

    @PostMapping("/csv")
    public ResponseEntity<Void> addUsersFromCsv(@RequestParam("file") MultipartFile file) {
        try {
            userService.addUsersFromCsv(file);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getStatusCode());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody UserLoginDTO userLoginDTO) {
        try {
            UserResponseDTO response = userService.login(userLoginDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(null, e.getStatusCode());
        }
    }

    @PutMapping("/{id}/git-credentials")
    public ResponseEntity<UserResponseDTO> updateGitCredentials(@PathVariable Long id, @Valid @RequestBody UserUpdateGitDTO updateGitDTO) {
        try {
            UserResponseDTO response = userService.updateGitCredentials(id, updateGitDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(null, e.getStatusCode());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        try {
            boolean deleted = userService.deleteUser(id);
            return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (ResponseStatusException e) {
            return new ResponseEntity<>(e.getStatusCode());
        }
    }
}