package com.message.tree.backend.service;

import com.message.tree.backend.dto.MessageDto;
import com.message.tree.backend.dto.UserInfo;
import com.message.tree.backend.entity.Message;
import com.message.tree.backend.entity.User;
import com.message.tree.backend.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;

    public Message createMessage(String content, User user, Long parentId) {
        Message message = new Message();
        message.setContent(content);
        message.setUser(user);
        message.setCreatedAt(LocalDateTime.now());
        
        if (parentId != null) {
            Optional<Message> parent = messageRepository.findById(parentId);
            parent.ifPresent(message::setParent);
        }
        
        return messageRepository.save(message);
    }

    /**
     * Get all top-level messages (those without a parent)
     */
    public List<MessageDto> getAllTopLevelMessages() {
        List<Message> messages = messageRepository.findByParentIsNullOrderByCreatedAtDesc();
        return buildMessageDtos(messages);
    }

    public List<MessageDto> getChildrenByParentId(Long parentId) {
        List<Message> children = messageRepository.findByParentId(parentId);
        return buildMessageDtos(children);
    }

    /**
     * Get all messages with user information and build a tree structure
     */
    public List<MessageDto> getAllMessagesWithTree() {
        // Get all messages with user information
        List<Message> allMessages = messageRepository.findAllWithUser();

        // Extract all message IDs for batch query
        List<Long> allMessageIds = allMessages.stream()
                .map(Message::getId)
                .toList();

        // Batch query to find which messages have children
        List<Long> parentIdsWithChildren = messageRepository.findParentIdsWithChildren(allMessageIds);
        Set<Long> hasChildrenSet = new java.util.HashSet<>(parentIdsWithChildren);

        Map<Long, MessageDto> messageMap = new HashMap<>();
        
        // Create all MessageDto objects with batch-determined hasChildren flag
        for (Message message : allMessages) {
            UserInfo userInfo = UserInfo.builder()
                    .username(message.getUser().getUsername())
                    .email(message.getUser().getEmail())
                    .build();

            boolean hasChildren = hasChildrenSet.contains(message.getId());

            MessageDto messageDto = new MessageDto(
                    message.getId(),
                    message.getContent(),
                    message.getCreatedAt(),
                    userInfo,
                    new ArrayList<>(),
                    hasChildren
            );
            
            messageMap.put(message.getId(), messageDto);
        }

        List<MessageDto> topLevelMessages = new ArrayList<>();
        
        for (Message message : allMessages) {
            MessageDto currentDto = messageMap.get(message.getId());
            
            if (message.getParent() == null) {
                topLevelMessages.add(currentDto);
            } else {
                MessageDto parentDto = messageMap.get(message.getParent().getId());
                if (parentDto != null) {
                    parentDto.getChildren().add(currentDto);
                }
            }
        }

        topLevelMessages.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        sortChildrenRecursively(topLevelMessages);
        
        return topLevelMessages;
    }

    /**
     * batch build message
     */
    private List<MessageDto> buildMessageDtos(List<Message> messages) {
        if (messages.isEmpty()) {
            return new ArrayList<>();
        }

        // Extract message IDs for batch query
        List<Long> messageIds = messages.stream()
                .map(Message::getId)
                .toList();

        // Batch query to find which messages have children
        List<Long> parentIdsWithChildren = messageRepository.findParentIdsWithChildren(messageIds);
        Set<Long> hasChildrenSet = new java.util.HashSet<>(parentIdsWithChildren);

        // Build DTOs with batch-determined hasChildren flag
        return messages.stream()
                .map(message -> {
                    UserInfo userInfo = UserInfo.builder()
                            .username(message.getUser().getUsername())
                            .email(message.getUser().getEmail())
                            .build();

                    boolean hasChildren = hasChildrenSet.contains(message.getId());

                    return new MessageDto(
                            message.getId(),
                            message.getContent(),
                            message.getCreatedAt(),
                            userInfo,
                            new ArrayList<>(),
                            hasChildren
                    );
                })
                .toList();
    }

    // Recursively sort child messages
    private void sortChildrenRecursively(List<MessageDto> messages) {
        for (MessageDto message : messages) {
            if (message.getChildren() != null && !message.getChildren().isEmpty()) {
                message.getChildren().sort(Comparator.comparing(MessageDto::getCreatedAt));
                sortChildrenRecursively(message.getChildren());
            }
        }
    }

}
