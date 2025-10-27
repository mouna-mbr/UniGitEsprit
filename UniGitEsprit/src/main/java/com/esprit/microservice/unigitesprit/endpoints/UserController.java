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
        UserResponseDTO responses = userService.updateUser(id, user);
        if (responses != null) {return new ResponseEntity<>(responses, HttpStatus.OK);}
        return new ResponseEntity<>(responses, HttpStatus.NOT_FOUND);
    }
    @PostMapping
    public ResponseEntity<UserResponseDTO> addUser(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        UserResponseDTO response = userService.addUser(userCreateDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/bulk")
    public ResponseEntity<List<UserResponseDTO>> addUsersBulk(@Valid @RequestBody List<UserCreateDTO> userCreateDTOs) {
        List<UserResponseDTO> responses = userService.addUsersBulk(userCreateDTOs);
        return new ResponseEntity<>(responses, HttpStatus.CREATED);
    }

    @PostMapping("/csv")
    public ResponseEntity<List<UserResponseDTO>> addUsersFromCsv(@RequestParam("file") MultipartFile file) {
        if( userService.addUsersFromCsv(file)){
        return new ResponseEntity<>( HttpStatus.CREATED);}else
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody UserLoginDTO userLoginDTO) {
        UserResponseDTO response = userService.login(userLoginDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}/git-credentials")
    public ResponseEntity<UserResponseDTO> updateGitCredentials(@PathVariable Long id, @Valid @RequestBody UserUpdateGitDTO updateGitDTO) {
        UserResponseDTO response = userService.updateGitCredentials(id, updateGitDTO);
        if (response!=null){return new ResponseEntity<>(response, HttpStatus.OK);}
        else return new ResponseEntity<>(response, HttpStatus.NOT_ACCEPTABLE);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        return userService.deleteUser(id)
                ? ResponseEntity.noContent().build()  // 204 if deleted
                : ResponseEntity.notFound().build();  // 404 if not found
    }
}