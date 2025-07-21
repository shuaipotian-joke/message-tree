package com.message.tree.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateMessageRequest {
    @NotBlank(message = "Message content cannot be empty")
    @Size(min = 3, max = 200, message = "Message must be 3-200 characters")
    private String content;

    private Long parentId;
} 