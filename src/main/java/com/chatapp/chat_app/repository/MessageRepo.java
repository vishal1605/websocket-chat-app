package com.chatapp.chat_app.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chatapp.chat_app.model.Message;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long>{

    @Modifying
    @Transactional
    @Query(value = "insert into chat_user_messages(chat_user_user_id,messages_message_id) values (:user_id, :m_id)", nativeQuery = true)
    public void saveMyMessage(@Param("user_id") long userId, @Param("m_id") long fId);

    //@Modifying
    @Query(value = "select * from message inner join chat_user_messages on message.message_id = chat_user_messages.messages_message_id where chat_user_user_id=?1 and to_user_user_id=?2",nativeQuery = true)
    public List<Message> getUserSpecificMessage(long userId, long fId);
    
    @Query(value = "select * from message inner join chat_user_messages on message.message_id = chat_user_messages.messages_message_id where chat_user_user_id=?1 and to_user_user_id=?2 ORDER BY send_date DESC;",nativeQuery = true)
    public List<Message> getUserSpecificLastMessage(long userId, long fId);
    
}
