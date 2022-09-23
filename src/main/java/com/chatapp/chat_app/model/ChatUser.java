package com.chatapp.chat_app.model;

import java.util.Arrays;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

@Entity
public class ChatUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long user_id;
    private String userName;
    private String password;
    private String email;

    @Transient
    private boolean isActive;

    @Lob
    private Byte[] profile_img;

    @OneToMany
    private List<Message> messages;

    public long getUser_id() {
        return user_id;
    }

    public void setUser_id(long user_id) {
        this.user_id = user_id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public Byte[] getProfile_img() {
        return profile_img;
    }

    public void setProfile_img(Byte[] profile_img) {
        this.profile_img = profile_img;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }

    public ChatUser(String userName, String password, String email) {
        this.userName = userName;
        this.password = password;
        this.email = email;
    }

    public ChatUser() {
        super();
    }

    @Override
    public String toString() {
        return "ChatUser [email=" + email + ", isActive=" + isActive + ", messages=" + messages + ", password="
                + password + ", profile_img=" + Arrays.toString(profile_img) + ", userName=" + userName + ", user_id="
                + user_id + "]";
    }
    
    
    
    
    
    

    
}
