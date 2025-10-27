package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.services.impl.GitLabMergeRequestService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/merge-requests")
public class MergeRequestController {
    private final GitLabMergeRequestService service;

    public MergeRequestController(GitLabMergeRequestService service) {
        this.service = service;
    }

    // ✅ Get all assigned merge requests
    @GetMapping("/{projectId}/assigned")
    public List<Map<String, Object>> getAssignedMRs(
            @PathVariable String projectId,
            @RequestParam(defaultValue = "opened") String state) {
        if (projectId == null || projectId.isBlank()) {
            throw new IllegalArgumentException("Missing projectId in request path");
        }
        return service.getAssignedMergeRequests(projectId, state);
    }
    @GetMapping("/assigned")
    public List<Map<String, Object>> getAssignedMergeRequests(
            @RequestParam(defaultValue = "opened") String state, @RequestParam String username
    ) {
        return service.getAssignedPullRequests(state, username);
    }


    @PostMapping("/{projectId}/{mrIid}/approve")
    public Map<String, Object> approveMR(
            @PathVariable String projectId,
            @PathVariable String mrIid) {
        return service.approveMergeRequest(projectId, mrIid);
    }

    @PostMapping("/{projectId}/{mrIid}/merge")
    public Map<String, Object> mergeMR(
            @PathVariable String projectId,
            @PathVariable String mrIid) {
        return service.mergeMergeRequest(projectId, mrIid);
    }
}
