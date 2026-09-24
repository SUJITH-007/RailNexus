package com.railnexus.security;

import com.railnexus.entity.User;
import com.railnexus.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        System.out.println("\n========== JWT FILTER ==========");
        System.out.println("REQUEST: " + request.getMethod() + " " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");

        System.out.println("AUTH HEADER PRESENT: " + (authHeader != null));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("NO VALID AUTH HEADER");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        boolean valid = jwtService.isTokenValid(token);

        System.out.println("TOKEN VALID: " + valid);

        if (!valid) {
            System.out.println("TOKEN INVALID");
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtService.extractEmail(token);

        System.out.println("JWT EMAIL: " + email);

        User user = userRepository.findByEmail(email)
                .orElse(null);

        System.out.println("USER FOUND: " + (user != null));

        if (user == null) {
            System.out.println("USER NOT FOUND");
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("USER ROLE: " + user.getRole());
        System.out.println("USER STATUS: " + user.getStatus());

        if (user.getStatus().name().equals("BLOCKED")) {
            System.out.println("USER IS BLOCKED");
            filterChain.doFilter(request, response);
            return;
        }

        String role = user.getRole().name();

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );

        SecurityContextHolder.getContext()
                .setAuthentication(authentication);

        System.out.println("AUTHENTICATION CREATED");
        System.out.println("PRINCIPAL EMAIL: " + user.getEmail());
        System.out.println("AUTHORITY: ROLE_" + role);
        System.out.println("========== JWT FILTER END ==========\n");

        filterChain.doFilter(request, response);
    }
}