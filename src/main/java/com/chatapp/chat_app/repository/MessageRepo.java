package com.chatapp.chat_app.repository;

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
    
}
