package com.esprit.microservice.unigitesprit.services.impl;

// GitService.java

import com.esprit.microservice.unigitesprit.dto.*;
import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.repository.RepositoryRepository;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import com.esprit.microservice.unigitesprit.services.interfaces.GitServiceInterface;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GitService implements GitServiceInterface {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private RepositoryRepository repositoryRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${github.token}")
    private String githubToken;
    @Autowired
    private UserRepository userRepository;

    @Override
    public String createRepo(String repoName, String ownerUsername) {
        String url = "https://api.github.com/user/repos";

        Map<String, Object> body = Map.of(
                "name", repoName,
                "private", true,
                "auto_init", true,
                "description", "Repository created by " + ownerUsername
        );

        ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, new HttpEntity<>(body, buildHeaders()), Map.class
        );

        if (response.getStatusCode() == HttpStatus.CREATED) {
            String fullName = (String) response.getBody().get("html_url");
            return fullName;
        }
        throw new RuntimeException("Failed to create repo: " + response.getBody());
    }




    @Override
    public void addCollaborator(String repoFullName, String username, String permission) {
        try {
             repoFullName = repoFullName.substring(repoFullName.indexOf("github.com/") + "github.com/".length());

            String url = "https://api.github.com/repos/" + repoFullName + "/collaborators/" + username;

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(githubToken);
            headers.set("Accept", "application/vnd.github+json");
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = Map.of("permission", permission);
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✅ Added collaborator: " + username);
            } else {
                System.err.println("❌ GitHub API returned " + response.getStatusCode() + ": " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("⚠️ Failed to add collaborator: " + e.getMessage());
        }
    }


//    public void addCollaborator(String repoFullName, String username, String permission) {
//
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.setBearerAuth(githubToken);
//            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
//            headers.setContentType(MediaType.APPLICATION_JSON);
//
//            Map<String, String> body = Map.of("permission", permission);
//
//            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
//
//            try {
//                restTemplate.exchange(repoFullName, HttpMethod.PUT, entity, String.class);
//                System.out.println("Added collaborator: " + username);
//            } catch (Exception e) {
//                System.err.println("Failed to add collaborator: " + e.getMessage());
//            }
//        }

    public boolean verifyGitHubCredentials(String username, String accessToken) {
        String url = "https://api.github.com/users/" + username;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "token " + accessToken);
        headers.set("Accept", "application/vnd.github.v3+json");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return true;
        } catch (HttpClientErrorException e) {
            return false;
        }
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(githubToken);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
    public GitRepositoryDTO getRepositoryInfo(String repoUrl) {
        try {
            String apiUrl = convertToApiUrl(repoUrl);
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "token " + githubToken);
            headers.set("Accept", "application/vnd.github.v3+json"); // GitHub API standard
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
    @Override
    public List<GitBranchDTO> getBranches(String repoUrl) {
        try {
            String apiUrl = convertToApiUrl(repoUrl) + "/branches";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "token " + githubToken);
            headers.set("Accept", "application/vnd.github.v3+json"); // GitHub API standard
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                return parseBranches(jsonNode);
            } else {
                throw new RuntimeException("GitHub API returned status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération des branches: " + e.getMessage(), e);
        }
    }
    @Override
    public List<GitCommitDTO> getCommits(String repoUrl,  String branch, int page, int perPage) {
        try {
            String apiUrl = convertToApiUrl(repoUrl) + "/commits?sha=" + branch + "&page=" + page + "&per_page=" + perPage;
            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/vnd.github.v3+json"); // GitHub API standard
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
    @Override
    public List<GitFileDTO> getFiles(String repoUrl, String branch, String path) {
        try {
            String apiUrl = convertToApiUrl(repoUrl) + "/contents/" + (path != null ? path : "");
            if (branch != null) {
                apiUrl += "?ref=" + branch;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/vnd.github.v3+json"); // GitHub API standard
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
    @Override
    public GitFileContentDTO getFileContent(String repoUrl,  String path, String branch) {
        try {
            String apiUrl = convertToApiUrl(repoUrl) + "/contents/" + path;
            if (branch != null) {
                apiUrl += "?ref=" + branch;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.set("Accept", "application/vnd.github.v3+json"); // GitHub API standard
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
    @Override
    public HttpHeaders createHeaders(User user) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/vnd.github.v3+json");

        if (user != null && user.getGitAccessToken() != null && !user.getGitAccessToken().isEmpty()) {
            // Pour GitHub, on utilise généralement le token seul avec le préfixe "token"
            headers.set("Authorization", "token " + user.getGitAccessToken());

            // Alternative: Basic auth avec username:token
            // String auth = user.getGitUsername() + ":" + user.getGitAccessToken();
            // String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            // headers.set("Authorization", "Basic " + encodedAuth);
        }

        return headers;
    }
    @Override
    public String convertToApiUrl(String repoUrl) {
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

        if (jsonNode.isArray()) {
            for (JsonNode branchNode : jsonNode) {
                GitBranchDTO branchDTO = new GitBranchDTO();

                // Vérifier l'existence des champs avant de les lire
                if (branchNode.has("name")) {
                    branchDTO.setName(branchNode.get("name").asText());
                } else {
                    continue; // Skip si pas de nom
                }

                if (branchNode.has("protected")) {
                    branchDTO.setProtectedBranch(branchNode.get("protected").asBoolean());
                } else {
                    branchDTO.setProtectedBranch(false); // Valeur par défaut
                }

                // Parse commit information avec vérifications
                if (branchNode.has("commit")) {
                    JsonNode commitNode = branchNode.get("commit");
                    GitBranchCommitDTO commitDTO = new GitBranchCommitDTO();

                    if (commitNode.has("sha")) {
                        commitDTO.setSha(commitNode.get("sha").asText());
                    }

                    if (commitNode.has("commit") && commitNode.get("commit").has("message")) {
                        commitDTO.setMessage(commitNode.get("commit").get("message").asText());
                    }

                    // Parse author information avec vérifications
                    if (commitNode.has("commit") && commitNode.get("commit").has("author")) {
                        JsonNode authorNode = commitNode.get("commit").get("author");
                        GitAuthorDTO authorDTO = new GitAuthorDTO();

                        if (authorNode.has("name")) {
                            authorDTO.setName(authorNode.get("name").asText());
                        }

                        if (authorNode.has("email")) {
                            authorDTO.setEmail(authorNode.get("email").asText());
                        }

                        if (authorNode.has("date")) {
                            try {
                                authorDTO.setDate(LocalDateTime.parse(
                                        authorNode.get("date").asText(),
                                        DateTimeFormatter.ISO_DATE_TIME
                                ));
                            } catch (Exception e) {
                                authorDTO.setDate(LocalDateTime.now());
                            }
                        }

                        if (commitNode.has("author") && commitNode.get("author").has("avatar_url")) {
                            authorDTO.setAvatarUrl(commitNode.get("author").get("avatar_url").asText());
                        }

                        commitDTO.setAuthor(authorDTO);
                    }

                    branchDTO.setCommit(commitDTO);
                }

                branches.add(branchDTO);
            }
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

        if (jsonNode.has("encoding")) {
            String encoding = jsonNode.get("encoding").asText();
            fileContentDTO.setEncoding(encoding);

            if (jsonNode.has("content")) {
                String content = jsonNode.get("content").asText();

                if ("base64".equals(encoding)) {
                    try {
                        String cleanContent = content.replaceAll("\\s+", "");
                        fileContentDTO.setContent(new String(Base64.getDecoder().decode(cleanContent)));
                    } catch (IllegalArgumentException e) {
                        fileContentDTO.setContent(content);
                        fileContentDTO.setEncoding("raw");
                    }
                } else {
                    fileContentDTO.setContent(content);
                }
            }
        }

        return fileContentDTO;
    }}
