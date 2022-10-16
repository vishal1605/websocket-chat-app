package com.chatapp.chat_app.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long message_id;
    private String fromUser;
    private String toUser;

    @Lob
    private String content;
    private String sendDate;
    private String recievedDate;
    
    @ManyToOne
    private ChatUser user;

    public long getMessage_id() {
        return message_id;
    }

    public void setMessage_id(long message_id) {
        this.message_id = message_id;
    }

    public String getFromUser() {
        return fromUser;
    }

    public void setFromUser(String fromUser) {
        this.fromUser = fromUser;
    }

    public String getToUser() {
        return toUser;
    }

    public void setToUser(String toUser) {
        this.toUser = toUser;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSendDate() {
        return sendDate;
    }

    public void setSendDate(String sendDate) {
        this.sendDate = sendDate;
    }

    public String getRecievedDate() {
        return recievedDate;
    }

    public void setRecievedDate(String recievedDate) {
        this.recievedDate = recievedDate;
    }

    public ChatUser getUser() {
        return user;
    }

    public void setUser(ChatUser user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Message [message_id=" + message_id + ", fromUser=" + fromUser + ", toUser=" + toUser + ", content="
                + content + ", sendDate=" + sendDate + ", recievedDate=" + recievedDate + ", user=" + user + "]";
    }  

    


    
}
