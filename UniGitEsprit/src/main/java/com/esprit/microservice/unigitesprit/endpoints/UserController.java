package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.*;
import com.esprit.microservice.unigitesprit.services.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // GET: Liste tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // POST: Ajouter un utilisateur
    @PostMapping
    public ResponseEntity<UserResponseDTO> addUser(@Valid @RequestBody UserCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.addUser(dto));
    }

    // POST: Ajouter plusieurs utilisateurs
    @PostMapping("/bulk")
    public ResponseEntity<List<UserResponseDTO>> addUsersBulk(@Valid @RequestBody List<UserCreateDTO> dtos) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.addUsersBulk(dtos));
    }

    // POST: Importer via CSV → Retourne un rapport
    @PostMapping("/csv")
    public ResponseEntity<CsvImportReport> addUsersFromCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new CsvImportReport(0, 0, List.of(new CsvError(0, "Fichier vide")))
            );
        }

        try {
            CsvImportReport report = userService.addUsersFromCsv(file);
            return ResponseEntity.ok(report);
        } catch (ResponseStatusException e) {
            // Erreur de validation ou lecture CSV
            CsvError error = new CsvError(0, e.getReason());
            return ResponseEntity.status(e.getStatusCode())
                    .body(new CsvImportReport(0, 0, List.of(error)));
        }
    }

    // PUT: Mettre à jour un utilisateur
    @PutMapping("/{identifiant}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable String identifiant,
            @Valid @RequestBody UserUpdateDTO dto) {
        return ResponseEntity.ok(userService.updateUser(identifiant, dto));
    }

    // PUT: Mettre à jour les identifiants Git
    @PutMapping("/{id}/git-credentials")
    public ResponseEntity<UserResponseDTO> updateGit(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateGitDTO dto) {
        return ResponseEntity.ok(userService.updateGitCredentials(id, dto));
    }

    // POST: Login
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody UserLoginDTO dto) {
        return ResponseEntity.ok(userService.login(dto));
    }

    // DELETE: Supprimer un utilisateur
    @DeleteMapping("/{identifiant}")
    public ResponseEntity<Void> deleteUser(@PathVariable String identifiant) {
        userService.deleteUser(identifiant);
        return ResponseEntity.noContent().build();
    }

    // Gestion globale des erreurs
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(ex.getReason());
    }
}