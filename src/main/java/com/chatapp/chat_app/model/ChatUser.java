package com.chatapp.chat_app.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinColumns;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.SecondaryTable;
import javax.persistence.Transient;

import org.hibernate.annotations.CollectionId;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class ChatUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long user_id;
    private String userName;
    private String dummyName;
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
    @OneToMany(mappedBy = "myFriend")
    @JsonIgnore
    private List<Friends> friend;
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

    public void setMessages(Set<Message> messages) {
        this.messages = messages;
    }

    public Set<Message> getMessages() {
        return messages;
    }

    public String getDummyName() {
        return dummyName;
    }

    public void setDummyName(String dummyName) {
        this.dummyName = dummyName;
    }

    public List<Friends> getFriend() {
        return friend;
    }

    public void setFriend(List<Friends> friend) {
        this.friend = friend;
    }

    @Override
    public String toString() {
        return "ChatUser [user_id=" + user_id + ", userName=" + userName + ", dummyName=" + dummyName + ", password="
                + password + ", email=" + email + ", isActive=" + isActive + ", profile_img="
                + Arrays.toString(profile_img) + ", messages=" + messages + ", friend=" + friend + "]";
    }

    

    

    

    
    

}
