package com.message.tree.backend.controller;

import com.message.tree.backend.dto.AuthResponse;
import com.message.tree.backend.dto.LoginRequest;
import com.message.tree.backend.dto.RegisterRequest;
import com.message.tree.backend.dto.UserInfo;
import com.message.tree.backend.entity.User;
import com.message.tree.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Validated RegisterRequest request) {
        try {
            userService.registerUser(request.getUsername(), request.getPassword(), request.getEmail());
            return ResponseEntity.ok(AuthResponse.builder().success(true).build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(AuthResponse.builder().success(false).message(e.getMessage()).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse.builder().success(false).message("Registration failed").build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Validated LoginRequest request, HttpServletRequest httpRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            // Handle remember me functionality
            if (request.isRememberMe()) {
                // Set session timeout to a month
                session.setMaxInactiveInterval(30 * 24 * 60 * 60);
            } else {
                // Default session timeout (typically 30 minutes)
                session.setMaxInactiveInterval(30 * 60);
            }

            return ResponseEntity.ok(AuthResponse.builder().success(true).build());
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(AuthResponse.builder().success(false).message("Invalid credentials").build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(AuthResponse.builder().success(false).message("Login failed").build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(AuthResponse.builder().success(true).message("Successfully logged out").build());
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfo> me(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.ok(null);
        }
        User user = userService.findByUsername(userDetails.getUsername()).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new UserInfo(user.getUsername(), user.getEmail()));
    }
}
