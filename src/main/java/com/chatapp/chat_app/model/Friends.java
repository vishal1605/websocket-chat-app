package com.chatapp.chat_app.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Friends {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long fId;

    private String saveName;

    @ManyToOne
    private ChatUser myFriend;

    private long user;

    public long getfId() {
        return fId;
    }
    public void setfId(long fId) {
        this.fId = fId;
    }
    public String getRename() {
        return saveName;
    }
    public void setRename(String rename) {
        this.saveName = rename;
    }
    public ChatUser getUser() {
        return myFriend;
    }
    public void setUser(ChatUser myFriend) {
        this.myFriend = myFriend;
    }
    public Friends(long fId, String saveName, ChatUser myFriend) {
        this.fId = fId;
        this.saveName = saveName;
        this.myFriend = myFriend;
    }
    public Friends() {
    }
    public Friends(String saveName, ChatUser myFriend, long user) {
        this.saveName = saveName;
        this.myFriend = myFriend;
        this.user = user;
    }
    @Override
    public String toString() {
        return "Friends [fId=" + fId + ", saveName=" + saveName + ", myFriend=" + myFriend + ", user=" + user + "]";
    }

    
    

    

}
