// src/main/java/com/esprit/microservice/unigitesprit/dto/UserCsvDTO.java
package com.esprit.microservice.unigitesprit.dto;

import com.opencsv.bean.CsvBindByName;
import lombok.Data;

@Data
public class UserCsvDTO {
    @CsvBindByName(column = "firstName")
    private String firstName;

    @CsvBindByName(column = "lastName")
    private String lastName;

    @CsvBindByName(column = "email")
    private String email;

    @CsvBindByName(column = "roles") // "STUDENT;PROFESSOR"
    private String roles;

    @CsvBindByName(column = "identifiant")
    private String identifiant;

    @CsvBindByName(column = "password")
    private String password;

    @CsvBindByName(column = "classe")
    private String classe;

    @CsvBindByName(column = "specialite")
    private String specialite;

    @CsvBindByName(column = "gitUsername")
    private String gitUsername;

    @CsvBindByName(column = "gitAccessToken")
    private String gitAccessToken;

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getRoles() {
        return roles;
    }

    public String getIdentifiant() {
        return identifiant;
    }

    public String getPassword() {
        return password;
    }

    public String getClasse() {
        return classe;
    }

    public String getSpecialite() {
        return specialite;
    }

    public String getGitUsername() {
        return gitUsername;
    }

    public String getGitAccessToken() {
        return gitAccessToken;
    }
}