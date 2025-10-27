package com.esprit.microservice.unigitesprit.endpoints;

import com.esprit.microservice.unigitesprit.dto.AuthRequest;
import com.esprit.microservice.unigitesprit.dto.AuthResponse;
import com.esprit.microservice.unigitesprit.dto.RegisterRequest;
import com.esprit.microservice.unigitesprit.services.impl.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest r) {
        return ResponseEntity.ok(authService.login(r.username, r.password));
    }


}
