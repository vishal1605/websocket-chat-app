package com.chatapp.chat_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chatapp.chat_app.model.Message;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long>{
    
}
