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

    public ChatUser saveUser(ChatUser u) {
        u.setDummyName(RandGeneratedStr());
        ChatUser row = userRepo.save(u);
        return row;
    }

    public ChatUser login(String username) {
        ChatUser u = userRepo.findByUserName(username);
        return u;
    }

    public ChatUser getSingleUser(long id) {
        Optional<ChatUser> op = userRepo.findById(id);
        ChatUser user = op.get();
        return user;
    }

    public String saveMyFriend(long u_id, long f_id, String fName) {
        userRepo.saveMyFriends(u_id, f_id, fName);
        return "success";
    }

    public List<ChatUser> getAllFriends(long id) {
        List<ChatUser> list = getOnlyFriends(id);
        return list;

    }

    private List<ChatUser> getOnlyFriends(long id) {
        List<ChatUser> friends = new ArrayList<>();
        userRepo.listOfFriends(id).forEach((f) -> {
            f.getFriend().clear();
            friends.add(f);
        });
        return friends;
    }

    public List<ChatUser> getAllChatUser() {
        List<ChatUser> users = new ArrayList<>();
        userRepo.findAll().forEach((e) -> {
            e.getFriend().clear();
            users.add(e);
        });
        return users;
    }

    public void deleteSingleFriend(long u_id, long f_id) {
        userRepo.deleteMyFriend(u_id, f_id);

    }

    public void uploadProfilePic(byte[] profileImg, long user_id) {
        userRepo.updateProfilePic(profileImg, user_id);
    }

    public byte[] getLoggedInPic(long user_id) {
        byte[] profilePic = userRepo.getProfilePic(user_id);
        return profilePic;
    }

    static String RandGeneratedStr() {

        String AlphaNumericStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxyz0123456789";
        StringBuilder s = new StringBuilder(12);
        int i;
        for (i = 0; i < 12; i++) {
            int ch = (int) (AlphaNumericStr.length() * Math.random());
            s.append(AlphaNumericStr.charAt(ch));

        }

        return s.toString();

    }

}
