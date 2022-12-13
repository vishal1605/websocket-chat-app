package com.chatapp.chat_app.services;

import java.util.List;
import java.util.Optional;

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
        return fRepo.save(new Friends(saveAs, friend, u_id, false, true));
    }
    public Friends saveMyFriends1(long id, String saveAs, ChatUser friend, long u_id, boolean blocked){
        return fRepo.save(new Friends(id,saveAs, friend, u_id, blocked, true));
    }
    public Friends saveBlockedFriends(ChatUser friend, long u_id, boolean isBlocked){
        return fRepo.save(new Friends(friend, u_id, isBlocked, false));
    }
    public Friends updateSaveBlockedFriends(long existingRowId, String saveName, ChatUser friend, long u_id, boolean is_blocked, boolean isFriend){
        return fRepo.save(new Friends(existingRowId, saveName,friend, u_id, is_blocked, isFriend));
    }

    public List<Friends> getAllFriends(long u_id){
        return fRepo.listOfFriends(u_id);
    }

    public void deleteSingleFriend(long uId, long fid){
        fRepo.deleteMyFriend(uId, fid);
    }

    public void renameMyFriend(String rename, long u_id, long f_id){
        fRepo.renameFriend(rename, u_id, f_id);
    }
    
    public Friends checkBlockedOrNot(long uId, long fid) {
    	return fRepo.checkBlockedOrNot(uId, fid);
    }
    
    public void updateMakeFriend(String rename, long f_id){
        fRepo.updateMakeFriend(rename, true, f_id);
    }
    
    public void updateBlockedFriend(long fId) {
    	fRepo.updateBlockedFriend(true, fId);
    }
    public void updateUnBlockedFriend(long fId) {
    	fRepo.updateBlockedFriend(false, fId);
    }

    public List<Friends> listOfBlockFriends(long user_id){
        return fRepo.listOfBlockFriends(user_id);
    }
}
