package com.message.tree.backend.controller;

import com.message.tree.backend.dto.CreateMessageRequest;
import com.message.tree.backend.dto.MessageDto;
import com.message.tree.backend.dto.MessageIdResponse;
import com.message.tree.backend.entity.Message;
import com.message.tree.backend.entity.User;
import com.message.tree.backend.service.MessageService;
import com.message.tree.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<MessageIdResponse> createMessage(@RequestBody @Validated CreateMessageRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userService.findByUsername(principal.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        Message message = messageService.createMessage(request.getContent(), user, request.getParentId());
        return ResponseEntity.ok(new MessageIdResponse(message.getId()));
    }

    @GetMapping
    public ResponseEntity<List<MessageDto>> getAllMessages() {
        List<MessageDto> messages = messageService.getAllTopLevelMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/tree")
    public ResponseEntity<List<MessageDto>> getAllMessagesWithTree() {
        List<MessageDto> messages = messageService.getAllMessagesWithTree();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/{id}/children")
    public ResponseEntity<List<MessageDto>> getChildren(@PathVariable Long id) {
        List<MessageDto> children = messageService.getChildrenByParentId(id);
        return ResponseEntity.ok(children);
    }
} 