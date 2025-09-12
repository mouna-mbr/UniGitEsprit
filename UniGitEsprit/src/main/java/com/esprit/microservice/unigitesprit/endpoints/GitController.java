package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.*;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.services.impl.GitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/git")
@CrossOrigin(origins = "*")
public class GitController {

    @Autowired
    private GitService gitService;

    // Méthode utilitaire pour construire un objet User à partir de l'en-tête Authorization
    private User extractUserFromAuthHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Basic ")) {
            return null;
        }

        try {
            String base64Credentials = authHeader.substring("Basic ".length()).trim();
            String credentials = new String(Base64.getDecoder().decode(base64Credentials));

            // Format attendu : username:accessToken
            String[] parts = credentials.split(":", 2);
            if (parts.length != 2) {
                return null;
            }

            User user = new User();
            user.setGitUsername(parts[0]);
            user.setGitAccessToken(parts[1]);
            return user;

        } catch (Exception e) {
            return null;
        }
    }
    @GetMapping("/repository")
    public ResponseEntity<GitRepositoryDTO> getRepositoryInfo(
            @RequestParam String repoUrl,
            @RequestHeader("Authorization") String authHeader) {

        User currentUser = extractUserFromAuthHeader(authHeader);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        GitRepositoryDTO repoInfo = gitService.getRepositoryInfo(repoUrl, currentUser);
        return ResponseEntity.ok(repoInfo);
    }

    @GetMapping("/branches")
    public ResponseEntity<?> getBranches(
            @RequestParam String repoUrl,
            @RequestHeader("Authorization") String authHeader) {

        try {
            User currentUser = extractUserFromAuthHeader(authHeader);
            if (currentUser == null) {
                return ResponseEntity.status(401).body("Authentication required");
            }

            if (repoUrl == null || repoUrl.isEmpty()) {
                return ResponseEntity.badRequest().body("Repository URL is required");
            }

            List<GitBranchDTO> branches = gitService.getBranches(repoUrl, currentUser);
            return ResponseEntity.ok(branches);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching branches: " + e.getMessage());
        }
    }

    @GetMapping("/commits")
    public ResponseEntity<List<GitCommitDTO>> getCommits(
            @RequestParam String repoUrl,
            @RequestParam(required = false) String branch,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "30") int perPage,
            @RequestHeader("Authorization") String authHeader) {

        User currentUser = extractUserFromAuthHeader(authHeader);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        List<GitCommitDTO> commits = gitService.getCommits(repoUrl, currentUser, branch, page, perPage);
        return ResponseEntity.ok(commits);
    }

    @GetMapping("/files")
    public ResponseEntity<List<GitFileDTO>> getFiles(
            @RequestParam String repoUrl,
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String path,
            @RequestHeader("Authorization") String authHeader) {

        User currentUser = extractUserFromAuthHeader(authHeader);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        List<GitFileDTO> files = gitService.getFiles(repoUrl, currentUser, branch, path);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/file-content")
    public ResponseEntity<GitFileContentDTO> getFileContent(
            @RequestParam String repoUrl,
            @RequestParam String path,
            @RequestParam(required = false) String branch,
            @RequestHeader("Authorization") String authHeader) {

        User currentUser = extractUserFromAuthHeader(authHeader);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        GitFileContentDTO fileContent = gitService.getFileContent(repoUrl, currentUser, path, branch);
        return ResponseEntity.ok(fileContent);
    }

    @PostMapping("/repository-info")
    public ResponseEntity<GitRepositoryDTO> getRepositoryInfoWithRequest(
            @RequestBody GitRepositoryRequestDto request,
            @RequestHeader("Authorization") String authHeader) {

        User currentUser = extractUserFromAuthHeader(authHeader);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        GitRepositoryDTO repoInfo = gitService.getRepositoryInfo(request.getRepoUrl(), currentUser);
        return ResponseEntity.ok(repoInfo);
    }

    @PostMapping("/file-content")
    public ResponseEntity<GitFileContentDTO> getFileContentWithRequest(
            @RequestBody GitFileContentRequestDto request,
            @RequestHeader("Authorization") String authHeader) {

        User currentUser = extractUserFromAuthHeader(authHeader);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        GitFileContentDTO fileContent = gitService.getFileContent(
                request.getRepoUrl(), currentUser, request.getPath(), request.getBranch());
        return ResponseEntity.ok(fileContent);
    }

    @PostMapping("/commits")
    public ResponseEntity<List<GitCommitDTO>> getCommitsWithRequest(
            @RequestBody GitCommitRequestDto request,
            @RequestHeader("Authorization") String authHeader) {

        User currentUser = extractUserFromAuthHeader(authHeader);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        List<GitCommitDTO> commits = gitService.getCommits(
                request.getRepoUrl(), currentUser, request.getBranch(),
                request.getPage(), request.getPerPage());
        return ResponseEntity.ok(commits);
    }
}