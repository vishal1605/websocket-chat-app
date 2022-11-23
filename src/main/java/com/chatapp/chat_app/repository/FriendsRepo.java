package com.chatapp.chat_app.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chatapp.chat_app.model.Friends;

@Repository
public interface FriendsRepo extends JpaRepository<Friends, Long>{

    @Query(value = "select * from friends where user = ?;",nativeQuery = true)
    public List<Friends> listOfFriends(long id);

    @Modifying
    @Transactional
    @Query(value = "delete from friends where user = :user_id and my_friend_user_id = :f_id", nativeQuery = true)
    public void deleteMyFriend(@Param("user_id") long userId, @Param("f_id") long fId);
    
}
