package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class GitLabMergeRequestService {
    private final RestTemplate restTemplate = new RestTemplate();

    // Move to application.yml for security
    private static final String GITHUB_API_BASE = "https://api.github.com";

    @Value("${github.token}")
    private String PRIVATE_TOKEN;
    @Autowired
    private UserRepository userRepository;

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("PRIVATE-TOKEN", PRIVATE_TOKEN); // <-- Use your token here
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public List<Map<String, Object>> getAssignedPullRequests(String state, String connectedUsername) {
        // 1️⃣ Get user info from DB
        User user = userRepository.findByIdentifiant(connectedUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String githubToken = user.getGitAccessToken();

        // 2️⃣ Build request to GitHub API
        String url = "https://api.github.com/issues?filter=assigned&state=" + state;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(githubToken);
        headers.set("Accept", "application/vnd.github+json");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        // 3️⃣ Call GitHub
        ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);

        // 4️⃣ Return list of assigned PRs
        List<Map<String, Object>> issues = response.getBody();
        return issues != null ? issues : Collections.emptyList();
    }

    //    public List<Map<String, Object>> getAssignedPullRequests(String state, String connectedUsername) {
//        // 1. Retrieve user info from DB
//        User user = userRepository.findByIdentifiant(connectedUsername)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        String githubUsername = user.getGitUsername();
//        String githubToken = user.getGitAccessToken();
//
//        // 2. Build request to GitHub API
//        String url = "https://api.github.com/search/issues?q=assignee:" + githubUsername +
//                "+is:pr+state:" + state;
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setBearerAuth(githubToken); // use token of connected user
//        headers.set("Accept", "application/vnd.github+json");
//
//        HttpEntity<Void> entity = new HttpEntity<>(headers);
//
//        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
//
//        // 3. Extract pull requests from response
//        List<Map<String, Object>> items = (List<Map<String, Object>>) response.getBody().get("items");
//        return items;
//    }
    public List<Map<String, Object>> getAssignedMergeRequests(String state) {
        String url = UriComponentsBuilder
                .fromHttpUrl(GITHUB_API_BASE + "/merge_requests")
                .queryParam("scope", "assigned_to_me")
                .queryParam("state", state)
                .toUriString();

        HttpEntity<String> entity = new HttpEntity<>(createHeaders());

        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                List.class
        );

        return response.getBody();
    }

    // ✅ Get Merge Requests assigned to the authenticated user
    public List<Map<String, Object>> getAssignedMergeRequests(String projectId, String state) {
        if (projectId == null || projectId.isEmpty()) {
            throw new IllegalArgumentException("projectId must not be null or empty");
        }
        String url = UriComponentsBuilder
                .fromHttpUrl(GITHUB_API_BASE + "/projects/{projectId}/merge_requests")
                .queryParam("state", state)
                .queryParam("scope", "assigned_to_me")
                .buildAndExpand(projectId)
                .toUriString();

        HttpEntity<String> entity = new HttpEntity<>(createHeaders());

        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                List.class
        );

        return response.getBody();
    }


    // ✅ Approve a merge request
    public Map<String, Object> approveMergeRequest(String projectId, String mrIid) {
        String url = GITHUB_API_BASE + "/merge_requests/{mrIid}/approve";
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, entity, Map.class, projectId, mrIid
        );
        return response.getBody();
    }

    // ✅ Merge a merge request
    public Map<String, Object> mergeMergeRequest(String projectId, String mrIid) {
        String url = GITHUB_API_BASE + "/merge_requests/{mrIid}/merge";
        HttpEntity<String> entity = new HttpEntity<>(createHeaders());
        ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.PUT, entity, Map.class, projectId, mrIid
        );
        return response.getBody();
    }
}
