package com.chatapp.chat_app.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chatapp.chat_app.model.ChatUser;
import com.chatapp.chat_app.model.Message;
import com.chatapp.chat_app.repository.MessageRepo;

@Service
public class MessageDao {

    @Autowired
    private MessageRepo repo;

    public Message saveMessage(long user_id,Message message){
        Message m = repo.save(message);
        repo.saveMyMessage(user_id, m.getMessage_id());
        return m;
    }
    public Message updateMessage(Message message){
        Message m = repo.save(message);
        return m;
    }

    public Message getSingleMessage(long messageId){
        return repo.findById(messageId).get();
    }
    
    public List<Message> getFriendMessages(long user_id, long f_id){
        List<Message> message = repo.getUserSpecificMessage(user_id, f_id);
        return message;

    }
    public List<Message> getFriendLastMessages(long user_id, long f_id){
        List<Message> message = repo.getUserSpecificLastMessage(user_id, f_id);
        return message;

    }
}
