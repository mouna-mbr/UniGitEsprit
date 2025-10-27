package com.esprit.microservice.unigitesprit.security;

import com.esprit.microservice.unigitesprit.enumeration.Role;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.*;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtUtil {
    private final String SECRET = "replace-with-very-secure-secret"; // move to props
    private final long EXP_MS = 24 * 3600 * 1000L;
    private static final String SECRET_KEY = "jJYJQ2z4qT4z2zX+5kz5i/2W3u+0s3YlS8kWOfYxV3Y=";

    public String generateToken(String username, Set<Role> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles.stream().map(Enum::name).collect(Collectors.toList()));
        return Jwts.builder()
                .setSubject(username)
                .addClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXP_MS))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return getBody(token).getSubject();
    }
    private Key getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    @SuppressWarnings("unchecked")
    public Set<Role> extractRoles(String token) {
        List<String> names = (List<String>) getBody(token).get("roles");
        if (names == null) return Collections.emptySet();
        return names.stream().map(Role::valueOf).collect(Collectors.toSet());
    }

    private Claims getBody(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // même clé que celle utilisée pour signer
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
