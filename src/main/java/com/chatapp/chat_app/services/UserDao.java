package com.chatapp.chat_app.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    public ChatUser getSingleUser(long id){
        Optional<ChatUser> op = userRepo.findById(id);
        ChatUser user = op.get();
        return user;
    }

    public String saveMyFriend(long u_id, long f_id){
        userRepo.saveMyFriends(u_id, f_id);
        return "success";
    }

    public List<ChatUser> getAllFriends(long id){
        List<ChatUser> list = getOnlyFriends(id);
        return list;

    }

    private List<ChatUser> getOnlyFriends(long id){
        List<ChatUser> friends = new ArrayList<>();
        userRepo.listOfFriends(id).forEach((f)->{
                f.getFriends().clear();
                friends.add(f);
            });
        return friends;
    } 

    public List<ChatUser> getAllChatUser(){
        List<ChatUser> users = new ArrayList<>();
        userRepo.findAll().forEach((e)->{
            e.getFriends().clear();
            users.add(e);
        });
        return users;
    }
    
}
