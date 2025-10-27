package com.esprit.microservice.unigitesprit.services.impl;

import com.esprit.microservice.unigitesprit.entities.User;
import com.esprit.microservice.unigitesprit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService {
    @Autowired
    private UserRepository userRepository;


    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByIdentifiant(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        List<GrantedAuthority> authorities = user.getRole().stream()
                .map(r -> new SimpleGrantedAuthority(r.name()))
                .collect(Collectors.toList());
        return new org.springframework.security.core.userdetails.User(
                user.getIdentifiant(), user.getPassword(), authorities);
    }
}
