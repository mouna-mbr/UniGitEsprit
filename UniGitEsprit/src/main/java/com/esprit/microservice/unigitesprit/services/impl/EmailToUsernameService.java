package com.esprit.microservice.unigitesprit.services.impl;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailToUsernameService {
    private static final Map<String, String> EMAIL_TO_USERNAME = Map.of(
            "iness.ben.rebah@gmail.com", "studentUser1",
            "manona.benrebah@esprit.tn", "studentUser2"
    );

    public String getUsername(String email) {
        return EMAIL_TO_USERNAME.get(email);
    }
}
