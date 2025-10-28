package com.esprit.microservice.unigitesprit.dto;

import lombok.Data;

@Data
public class CsvError {
    private final int line;
    private final String message;
}