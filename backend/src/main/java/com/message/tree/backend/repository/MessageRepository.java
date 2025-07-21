package com.message.tree.backend.repository;

import com.message.tree.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    
    @Query("SELECT m FROM Message m JOIN FETCH m.user WHERE m.parent.id = :parentId ORDER BY m.createdAt DESC")
    List<Message> findByParentId(@Param("parentId") Long parentId);
    
    @Query("SELECT m FROM Message m JOIN FETCH m.user WHERE m.parent IS NULL ORDER BY m.createdAt DESC")
    List<Message> findByParentIsNullOrderByCreatedAtDesc();
    
    @Query("SELECT m FROM Message m JOIN FETCH m.user ORDER BY m.createdAt")
    List<Message> findAllWithUser();
    
    @Query("SELECT DISTINCT m.parent.id FROM Message m WHERE m.parent.id IN :parentIds")
    List<Long> findParentIdsWithChildren(@Param("parentIds") List<Long> parentIds);
}
