package com.chatapp.chat_app.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.chatapp.chat_app.model.ChatUser;
import com.chatapp.chat_app.model.Friends;
import com.chatapp.chat_app.repository.FriendsRepo;

@Service
public class FriendsDao {

    @Autowired
    private FriendsRepo fRepo;

    public Friends saveMyFriends(String saveAs, ChatUser friend, long u_id){
        return fRepo.save(new Friends(saveAs, friend, u_id));
    }

    public List<Friends> getAllFriends(long u_id){
        return fRepo.listOfFriends(u_id);
    }

    public void deleteSingleFriend(long uId, long fid){
        fRepo.deleteMyFriend(uId, fid);
    }
    
}
