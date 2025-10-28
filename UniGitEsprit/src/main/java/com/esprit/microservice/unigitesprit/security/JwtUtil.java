package com.esprit.microservice.unigitesprit.security;

import com.esprit.microservice.unigitesprit.enumeration.Role;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Service;
import com.esprit.microservice.unigitesprit.security.JwtRequestFilter;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;@Component
public class JwtUtil {

    private static final String SECRET_KEY = "jJYJQ2z4qT4z2zX+5kz5i/2W3u+0s3YlS8kWOfYxV3Y="; // 256 bits
    private static final long EXP_MS = 24 * 3600 * 1000L; // 24h

    private final Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY));

    public String generateToken(String username, Set<Role> roles) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles.stream().map(Enum::name).toList())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXP_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return parseToken(token).getSubject();
    }

    public Set<Role> extractRoles(String token) {
        List<String> names = parseToken(token).get("roles", List.class);
        return names == null ? Collections.emptySet() :
                names.stream().map(Role::valueOf).collect(Collectors.toSet());
    }

    private Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}