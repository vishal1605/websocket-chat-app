package com.chatapp.chat_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.chatapp.chat_app.model.ChatUser;

@Repository
public interface ChatUserRepo extends JpaRepository<ChatUser, Long>{

    public ChatUser findByUserName(String name);

    @Modifying
    @Transactional
    @Query(value = "insert into chat_user_friends(chat_user_user_id,friends_user_id) values (:user_id, :f_id)", nativeQuery = true)
    public void saveMyFriends(@Param("user_id") long userId, @Param("f_id") long fId);

    @Query(value = "select user.* from chat_user user inner join chat_user_friends friends on user.user_id = friends.friends_user_id inner join chat_user user2 on friends.chat_user_user_id = user2.user_id where chat_user_user_id = ?;",nativeQuery = true)
    public List<ChatUser> listOfFriends(long id);

    
}
