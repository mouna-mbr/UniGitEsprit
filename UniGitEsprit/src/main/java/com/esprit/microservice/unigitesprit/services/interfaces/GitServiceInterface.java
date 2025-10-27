package com.esprit.microservice.unigitesprit.services.interfaces;

import com.esprit.microservice.unigitesprit.dto.*;
import com.esprit.microservice.unigitesprit.entities.User;
import org.springframework.http.HttpHeaders;

import java.util.List;

public interface GitServiceInterface {
    String createRepo(String repoName, String ownerUsername);



    void addCollaborator(String repoFullName, String username, String permission);

    GitRepositoryDTO getRepositoryInfo(String repoUrl);

    List<GitBranchDTO> getBranches(String repoUrl );

    List<GitCommitDTO> getCommits(String repoUrl, String branch, int page, int perPage);

    List<GitFileDTO> getFiles(String repoUrl,  String branch, String path);

    GitFileContentDTO getFileContent(String repoUrl, String path, String branch);

    HttpHeaders createHeaders(User user);

    String convertToApiUrl(String repoUrl);
}
