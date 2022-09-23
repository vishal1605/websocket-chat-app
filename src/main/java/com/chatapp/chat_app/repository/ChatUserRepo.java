package com.chatapp.chat_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.chatapp.chat_app.model.ChatUser;

@Repository
public interface ChatUserRepo extends JpaRepository<ChatUser, Long>{

    public ChatUser findByUserName(String name);
    
}
