package com.chatapp.chat_app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chatapp.chat_app.model.ChatUser;
import com.chatapp.chat_app.repository.ChatUserRepo;

@Service
public class UserDao {

    @Autowired
	private ChatUserRepo userRepo;

    public ChatUser saveUser(ChatUser u){
        ChatUser row = userRepo.save(u);
        return row;
    }

    public ChatUser login(String username){
        ChatUser u = userRepo.findByUserName(username);
        return u;
    }
    
}
