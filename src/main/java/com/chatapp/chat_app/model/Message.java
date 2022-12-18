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

    @ManyToOne
    private ChatUser toUser;

    @Lob
    private byte[] content;
    private byte[] recievedContent;
    private String msgLabel;
    private String sendDate;
    private String recievedDate;
    public long getMessage_id() {
        return message_id;
    }
    public void setMessage_id(long message_id) {
        this.message_id = message_id;
    }
    public ChatUser getToUser() {
        return toUser;
    }
    public void setToUser(ChatUser toUser) {
        this.toUser = toUser;
    }
    public byte[] getContent() {
        return content;
    }
    public void setContent(byte[] content) {
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
    public String getMsgLabel() {
		return msgLabel;
	}
	public void setMsgLabel(String msgLabel) {
		this.msgLabel = msgLabel;
	}
       
    
    public Message(ChatUser toUser, byte[] content, byte[] recievedContent, String msgLabel, String sendDate,
            String recievedDate) {
        this.toUser = toUser;
        this.content = content;
        this.recievedContent = recievedContent;
        this.msgLabel = msgLabel;
        this.sendDate = sendDate;
        this.recievedDate = recievedDate;
    }
    public Message(long message_id, ChatUser toUser, byte[] content, byte[] recievedContent, String msgLabel,
            String sendDate, String recievedDate) {
        this.message_id = message_id;
        this.toUser = toUser;
        this.content = content;
        this.recievedContent = recievedContent;
        this.msgLabel = msgLabel;
        this.sendDate = sendDate;
        this.recievedDate = recievedDate;
    }
    public Message(ChatUser toUser, byte[] content, String msgLabel, String sendDate) {
		super();
		this.toUser = toUser;
		this.content = content;
		this.msgLabel = msgLabel;
		this.sendDate = sendDate;
		this.recievedDate = recievedDate;
	}
	public Message() {
    }
    @Override
    public String toString() {
        return "Message [message_id=" + message_id + ", toUser=" + toUser + ", content=" + content + ", sendDate="
                + sendDate + ", recievedDate=" + recievedDate + "]";
    }
    public byte[] getRecievedContent() {
        return recievedContent;
    }
    public void setRecievedContent(byte[] recievedContent) {
        this.recievedContent = recievedContent;
    }
	
    
    
}
