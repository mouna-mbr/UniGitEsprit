package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.enumeration.TechnoLogies;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/Techno")
public class TechnologiesEndPoint {
    @GetMapping
    public List<TechnoLogies> getAllTechnologies() {
        return Arrays.asList(TechnoLogies.values());
}}
