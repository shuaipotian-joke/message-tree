package com.message.tree.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username cannot be empty")
    @Pattern(regexp = "^[A-Za-z0-9]{5,20}$", message = "Username must be 5-20 alphanumeric characters")
    private String username;

    @NotBlank(message = "Password cannot be empty")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,20}$",
        message = "Password must be 8-20 characters with uppercase, lowercase, digit, and special character"
    )
    private String password;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    private String email;
} 