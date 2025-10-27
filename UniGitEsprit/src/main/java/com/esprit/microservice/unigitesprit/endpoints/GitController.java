package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.*;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.services.impl.GitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
            @RequestParam String repoUrl
          ) {

        GitRepositoryDTO repoInfo = gitService.getRepositoryInfo(repoUrl);
        return ResponseEntity.ok(repoInfo);
    }

    @GetMapping("/branches")
    public ResponseEntity<?> getBranches(
            @RequestParam String repoUrl
           ) {

        try {


            if (repoUrl == null || repoUrl.isEmpty()) {
                return ResponseEntity.badRequest().body("Repository URL is required");
            }

            List<GitBranchDTO> branches = gitService.getBranches(repoUrl);
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
            @RequestParam(defaultValue = "30") int perPage
            ) {


        List<GitCommitDTO> commits = gitService.getCommits(repoUrl, branch, page, perPage);
        return ResponseEntity.ok(commits);
    }

    @GetMapping("/files")
    public ResponseEntity<List<GitFileDTO>> getFiles(
            @RequestParam String repoUrl,
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String path
           ) {


        List<GitFileDTO> files = gitService.getFiles(repoUrl, branch, path);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/file-content")
    public ResponseEntity<GitFileContentDTO> getFileContent(
            @RequestParam String repoUrl,
            @RequestParam String path,
            @RequestParam(required = false) String branch) {


        GitFileContentDTO fileContent = gitService.getFileContent(repoUrl,  path, branch);
        return ResponseEntity.ok(fileContent);
    }

    @PostMapping("/repository-info")
    public ResponseEntity<GitRepositoryDTO> getRepositoryInfoWithRequest(
            @RequestBody GitRepositoryRequestDto request) {


        GitRepositoryDTO repoInfo = gitService.getRepositoryInfo(request.getRepoUrl());
        return ResponseEntity.ok(repoInfo);
    }

    @PostMapping("/file-content")
    public ResponseEntity<GitFileContentDTO> getFileContentWithRequest(
            @RequestBody GitFileContentRequestDto request) {


        GitFileContentDTO fileContent = gitService.getFileContent(
                request.getRepoUrl(),  request.getPath(), request.getBranch());
        return ResponseEntity.ok(fileContent);
    }

    @PostMapping("/commits")
    public ResponseEntity<List<GitCommitDTO>> getCommitsWithRequest(
            @RequestBody GitCommitRequestDto request
           ) {


        List<GitCommitDTO> commits = gitService.getCommits(
                request.getRepoUrl(),  request.getBranch(),
                request.getPage(), request.getPerPage());
        return ResponseEntity.ok(commits);
    }
}