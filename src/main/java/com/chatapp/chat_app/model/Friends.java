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

    private boolean isBlocked;
    private boolean isFriend;

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

    public String getSaveName() {
        return saveName;
    }
    public void setSaveName(String saveName) {
        this.saveName = saveName;
    }
    public ChatUser getMyFriend() {
        return myFriend;
    }
    public void setMyFriend(ChatUser myFriend) {
        this.myFriend = myFriend;
    }
    public void setUser(long user) {
        this.user = user;
    }
    public boolean isBlocked() {
        return isBlocked;
    }
    public void setBlocked(boolean isBlocked) {
        this.isBlocked = isBlocked;
    }
    public Friends(long fId, String saveName, ChatUser myFriend) {
        this.fId = fId;
        this.saveName = saveName;
        this.myFriend = myFriend;
    }
    public Friends() {
    }
    @Override
    public String toString() {
        return "Friends [fId=" + fId + ", saveName=" + saveName + ", myFriend=" + myFriend + ", user=" + user + "]";
    }
    public boolean isFriend() {
        return isFriend;
    }
    public void setFriend(boolean isFriend) {
        this.isFriend = isFriend;
    }
    public Friends(String saveName, ChatUser myFriend, long user, boolean isBlocked, boolean isFriend) {
        this.saveName = saveName;
        this.myFriend = myFriend;
        this.user = user;
        this.isBlocked = isBlocked;
        this.isFriend = isFriend;
    }
    public Friends(ChatUser myFriend, long user, boolean isBlocked, boolean isFriend) {
        this.myFriend = myFriend;
        this.user = user;
        this.isBlocked = isBlocked;
        this.isFriend = isFriend;
    }
	public Friends(long fId, String saveName, ChatUser myFriend, long user, boolean isBlocked, boolean isFriend) {
		super();
		this.fId = fId;
		this.saveName = saveName;
		this.myFriend = myFriend;
		this.user = user;
		this.isBlocked = isBlocked;
		this.isFriend = isFriend;
	}
    
    
    

    

}
