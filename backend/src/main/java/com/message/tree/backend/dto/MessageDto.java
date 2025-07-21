package com.message.tree.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private UserInfo user;
    private List<MessageDto> children;
    private boolean hasChildren;

}
