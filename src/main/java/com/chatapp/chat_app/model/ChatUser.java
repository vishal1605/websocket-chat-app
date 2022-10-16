package com.chatapp.chat_app.model;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import com.fasterxml.jackson.annotation.JsonIgnore;

import net.bytebuddy.agent.builder.AgentBuilder.PoolStrategy.Eager;

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
    private byte[] profile_img;

    @OneToMany(fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<Message> messages;
    
    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany
    @JsonIgnore
    private List<ChatUser> friends;

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

    public byte[] getProfile_img() {
        return profile_img;
    }

    public void setProfile_img(byte[] profile_img) {
        this.profile_img = profile_img;
    }

    public List<ChatUser> getFriends() {
        return friends;
    }

    public void setFriends(List<ChatUser> friends) {
        this.friends = friends;
    }

    @Override
    public String toString() {
        return "ChatUser [user_id=" + user_id + ", userName=" + userName + ", password=" + password + ", email=" + email
                + ", isActive=" + isActive + ", profile_img=" + Arrays.toString(profile_img) + ", messages=" + messages
                + ", friends=" + friends + "]";
    }

    
    
    

    

    

    
}
