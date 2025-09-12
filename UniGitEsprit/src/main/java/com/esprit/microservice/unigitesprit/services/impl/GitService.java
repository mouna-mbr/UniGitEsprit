package com.esprit.microservice.unigitesprit.services.impl;

// GitService.java

import com.esprit.microservice.unigitesprit.dto.*;
import com.esprit.microservice.unigitesprit.entities.Repository;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.repository.RepositoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class GitService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public GitRepositoryDTO getRepositoryInfo(String repoUrl, User user) {
        try {
            String apiUrl = convertToApiUrl(repoUrl);
            HttpHeaders headers = createHeaders(user);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return parseRepositoryInfo(jsonNode);
            }
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération des informations du repository", e);
        }
        return null;
    }

    public List<GitBranchDTO> getBranches(String repoUrl, User user) {
        try {
            String apiUrl = convertToApiUrl(repoUrl) + "/branches";
            HttpHeaders headers = createHeaders(user);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return parseBranches(jsonNode);
            }
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération des branches", e);
        }
        return new ArrayList<>();
    }

    public List<GitCommitDTO> getCommits(String repoUrl, User user, String branch, int page, int perPage) {
        try {
            String apiUrl = convertToApiUrl(repoUrl) + "/commits?sha=" + branch + "&page=" + page + "&per_page=" + perPage;
            HttpHeaders headers = createHeaders(user);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return parseCommits(jsonNode);
            }
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération des commits", e);
        }
        return new ArrayList<>();
    }

    public List<GitFileDTO> getFiles(String repoUrl, User user, String branch, String path) {
        try {
            String apiUrl = convertToApiUrl(repoUrl) + "/contents/" + (path != null ? path : "");
            if (branch != null) {
                apiUrl += "?ref=" + branch;
            }

            HttpHeaders headers = createHeaders(user);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return parseFiles(jsonNode);
            }
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération des fichiers", e);
        }
        return new ArrayList<>();
    }

    public GitFileContentDTO getFileContent(String repoUrl, User user, String path, String branch) {
        try {
            String apiUrl = convertToApiUrl(repoUrl) + "/contents/" + path;
            if (branch != null) {
                apiUrl += "?ref=" + branch;
            }

            HttpHeaders headers = createHeaders(user);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return parseFileContent(jsonNode);
            }
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération du contenu du fichier", e);
        }
        return null;
    }

    private HttpHeaders createHeaders(User user) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/vnd.github.v3+json");

        if (user.getGitAccessToken() != null && !user.getGitAccessToken().isEmpty()) {
            String auth = user.getGitUsername() + ":" + user.getGitAccessToken();
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);
        }

        return headers;
    }

    private String convertToApiUrl(String repoUrl) {
        if (repoUrl.contains("github.com")) {
            String path = repoUrl.replace("https://github.com/", "")
                    .replace(".git", "");
            return "https://api.github.com/repos/" + path;
        }
        throw new IllegalArgumentException("URL GitHub non valide");
    }

    private GitRepositoryDTO parseRepositoryInfo(JsonNode jsonNode) {
        GitRepositoryDTO dto = new GitRepositoryDTO();
        dto.setId(jsonNode.get("id").asLong());
        dto.setName(jsonNode.get("name").asText());
        dto.setFullName(jsonNode.get("full_name").asText());
        dto.setDescription(jsonNode.get("description").asText());
        dto.setUrl(jsonNode.get("html_url").asText());
        dto.setDefaultBranch(jsonNode.get("default_branch").asText());
        dto.setPrivate(jsonNode.get("private").asBoolean());
        dto.setLanguage(jsonNode.get("language").asText());
        dto.setStars(jsonNode.get("stargazers_count").asInt());
        dto.setForks(jsonNode.get("forks_count").asInt());
        dto.setSize(jsonNode.get("size").asLong());

        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        dto.setCreatedAt(LocalDateTime.parse(jsonNode.get("created_at").asText(), formatter));
        dto.setUpdatedAt(LocalDateTime.parse(jsonNode.get("updated_at").asText(), formatter));

        // Parse owner
        JsonNode ownerNode = jsonNode.get("owner");
        GitOwnerDTO ownerDTO = new GitOwnerDTO();
        ownerDTO.setLogin(ownerNode.get("login").asText());
        ownerDTO.setAvatarUrl(ownerNode.get("avatar_url").asText());
        ownerDTO.setType(ownerNode.get("type").asText());
        ownerDTO.setUrl(ownerNode.get("html_url").asText());
        dto.setOwner(ownerDTO);

        return dto;
    }

    private List<GitBranchDTO> parseBranches(JsonNode jsonNode) {
        List<GitBranchDTO> branches = new ArrayList<>();
        for (JsonNode branchNode : jsonNode) {
            GitBranchDTO branchDTO = new GitBranchDTO();
            branchDTO.setName(branchNode.get("name").asText());

            JsonNode commitNode = branchNode.get("commit");
            GitBranchCommitDTO commitDTO = new GitBranchCommitDTO();
            commitDTO.setSha(commitNode.get("sha").asText());
            commitDTO.setMessage(commitNode.get("commit").get("message").asText());

            JsonNode authorNode = commitNode.get("commit").get("author");
            GitAuthorDTO authorDTO = new GitAuthorDTO();
            authorDTO.setName(authorNode.get("name").asText());
            authorDTO.setEmail(authorNode.get("email").asText());
            authorDTO.setAvatarUrl(commitNode.get("author").get("avatar_url").asText());
            authorDTO.setDate(LocalDateTime.parse(authorNode.get("date").asText(), DateTimeFormatter.ISO_DATE_TIME));

            commitDTO.setAuthor(authorDTO);
            branchDTO.setCommit(commitDTO);
            branchDTO.setProtectedBranch(branchNode.get("protected").asBoolean());

            branches.add(branchDTO);
        }
        return branches;
    }

    private List<GitCommitDTO> parseCommits(JsonNode jsonNode) {
        List<GitCommitDTO> commits = new ArrayList<>();
        for (JsonNode commitNode : jsonNode) {
            GitCommitDTO commitDTO = new GitCommitDTO();
            commitDTO.setSha(commitNode.get("sha").asText());
            commitDTO.setMessage(commitNode.get("commit").get("message").asText());
            commitDTO.setUrl(commitNode.get("html_url").asText());

            // Parse author
            JsonNode authorNode = commitNode.get("commit").get("author");
            GitAuthorDTO authorDTO = new GitAuthorDTO();
            authorDTO.setName(authorNode.get("name").asText());
            authorDTO.setEmail(authorNode.get("email").asText());
            authorDTO.setDate(LocalDateTime.parse(authorNode.get("date").asText(), DateTimeFormatter.ISO_DATE_TIME));
            commitDTO.setAuthor(authorDTO);

            // Parse committer
            JsonNode committerNode = commitNode.get("commit").get("committer");
            GitCommitterDTO committerDTO = new GitCommitterDTO();
            committerDTO.setName(committerNode.get("name").asText());
            committerDTO.setEmail(committerNode.get("email").asText());
            committerDTO.setDate(LocalDateTime.parse(committerNode.get("date").asText(), DateTimeFormatter.ISO_DATE_TIME));
            commitDTO.setCommitter(committerDTO);

            // Parse stats
            JsonNode statsNode = commitNode.get("stats");
            if (statsNode != null) {
                GitCommitStatsDTO statsDTO = new GitCommitStatsDTO();
                statsDTO.setAdditions(statsNode.get("additions").asInt());
                statsDTO.setDeletions(statsNode.get("deletions").asInt());
                statsDTO.setTotal(statsNode.get("total").asInt());
                commitDTO.setStats(statsDTO);
            }

            // Parse file changes
            JsonNode filesNode = commitNode.get("files");
            if (filesNode != null && filesNode.isArray()) {
                List<GitFileChangeDTO> fileChanges = new ArrayList<>();
                for (JsonNode fileNode : filesNode) {
                    GitFileChangeDTO fileChangedDTO = new GitFileChangeDTO();
                    fileChangedDTO.setFilename(fileNode.get("filename").asText());
                    fileChangedDTO.setStatus(fileNode.get("status").asText());
                    fileChangedDTO.setAdditions(fileNode.get("additions").asInt());
                    fileChangedDTO.setDeletions(fileNode.get("deletions").asInt());
                    fileChangedDTO.setChanges(fileNode.get("changes").asInt());
                    fileChanges.add(fileChangedDTO);
                }
                commitDTO.setFiles(fileChanges);
            }

            commits.add(commitDTO);
        }
        return commits;
    }

    private List<GitFileDTO> parseFiles(JsonNode jsonNode) {
        List<GitFileDTO> files = new ArrayList<>();
        for (JsonNode fileNode : jsonNode) {
            GitFileDTO fileDTO = new GitFileDTO();
            fileDTO.setName(fileNode.get("name").asText());
            fileDTO.setPath(fileNode.get("path").asText());
            fileDTO.setType(fileNode.get("type").asText());
            fileDTO.setSize(fileNode.get("size").asInt());
            fileDTO.setSha(fileNode.get("sha").asText());
            fileDTO.setDownloadUrl(fileNode.get("download_url").asText());

            files.add(fileDTO);
        }
        return files;
    }

    private GitFileContentDTO parseFileContent(JsonNode jsonNode) {
        GitFileContentDTO fileContentDTO = new GitFileContentDTO();
        fileContentDTO.setContent(jsonNode.get("content").asText());
        fileContentDTO.setEncoding(jsonNode.get("encoding").asText());

        String content = jsonNode.get("content").asText();
        fileContentDTO.setContent(new String(Base64.getDecoder().decode(content)));
        fileContentDTO.setEncoding(jsonNode.get("encoding").asText());

        return fileContentDTO;
    }
}
