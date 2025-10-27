package com.esprit.microservice.unigitesprit.endpoints;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        logger.info("Handling ResponseStatusException with message: {}", ex.getReason());
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getReason());
        return new ResponseEntity<>(errorResponse, ex.getStatusCode());
    }
}