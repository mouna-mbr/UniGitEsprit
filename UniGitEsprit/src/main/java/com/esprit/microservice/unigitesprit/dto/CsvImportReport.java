package com.esprit.microservice.unigitesprit.dto;

import lombok.Data;
import java.util.List;

@Data
public class CsvImportReport {
    private final int successCount;
    private final int totalProcessed;
    private final List<CsvError> errors;
}