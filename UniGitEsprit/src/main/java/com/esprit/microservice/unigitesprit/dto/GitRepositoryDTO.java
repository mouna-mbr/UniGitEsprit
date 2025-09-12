// GitRepositoryDTO.java
package com.esprit.microservice.unigitesprit.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GitRepositoryDTO {
    public Long id;
    public String name;
    public String fullName;
    public String description;
    public String url;
    public String defaultBranch;
    public boolean isPrivate;
    public String language;
    public int stars;
    public int forks;
    public long size;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;
    public GitOwnerDTO owner;

    public GitRepositoryDTO() {
    }

    public GitRepositoryDTO(Long id, String name, String fullName, String description, String url, String defaultBranch, boolean isPrivate, String language, int stars, int forks, long size, LocalDateTime createdAt, LocalDateTime updatedAt, GitOwnerDTO owner) {
        this.id = id;
        this.name = name;
        this.fullName = fullName;
        this.description = description;
        this.url = url;
        this.defaultBranch = defaultBranch;
        this.isPrivate = isPrivate;
        this.language = language;
        this.stars = stars;
        this.forks = forks;
        this.size = size;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getFullName() {
        return fullName;
    }

    public String getDescription() {
        return description;
    }

    public String getUrl() {
        return url;
    }

    public String getDefaultBranch() {
        return defaultBranch;
    }

    public boolean isPrivate() {
        return isPrivate;
    }

    public String getLanguage() {
        return language;
    }

    public int getStars() {
        return stars;
    }

    public int getForks() {
        return forks;
    }

    public long getSize() {
        return size;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public GitOwnerDTO getOwner() {
        return owner;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setDefaultBranch(String defaultBranch) {
        this.defaultBranch = defaultBranch;
    }

    public void setPrivate(boolean aPrivate) {
        isPrivate = aPrivate;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public void setForks(int forks) {
        this.forks = forks;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setOwner(GitOwnerDTO owner) {
        this.owner = owner;
    }
}