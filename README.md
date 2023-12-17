# websocket-chat-app

Spring boot Websocket chat app

  

# Sql Queries for create table structure
###  1) Chat user table

```sql
CREATE TABLE `chat_user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `dummy_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_img` longblob,
  `user_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
###  2) Message table
```sql
CREATE TABLE `message` (
  `message_id` bigint NOT NULL,
  `content` longblob,
  `recieved_content` longblob,
  `msg_label` varchar(255) DEFAULT NULL,
  `recieved_date` varchar(255) DEFAULT NULL,
  `send_date` varchar(255) DEFAULT NULL,
  `to_user_user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `FKqumcy6hmow228nk518uy1ayyd` (`to_user_user_id`),
  CONSTRAINT `FKqumcy6hmow228nk518uy1ayyd` FOREIGN KEY (`to_user_user_id`) REFERENCES `chat_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
###  3) friends table
```sql
CREATE TABLE `friends` (
  `f_id` bigint NOT NULL AUTO_INCREMENT,
  `save_name` varchar(255) DEFAULT NULL,
  `user` bigint NOT NULL,
  `my_friend_user_id` bigint DEFAULT NULL,
  `is_blocked` bit(1) DEFAULT NULL,
  `is_friend` bigint DEFAULT NULL,
  PRIMARY KEY (`f_id`),
  KEY `FKnae7pds9coh6g0spqiaej8ekk` (`my_friend_user_id`),
  CONSTRAINT `FKnae7pds9coh6g0spqiaej8ekk` FOREIGN KEY (`my_friend_user_id`) REFERENCES `chat_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
###  4) Chat user message
```sql
CREATE TABLE `chat_user_messages` (
  `user_message_id` bigint NOT NULL AUTO_INCREMENT,
  `chat_user_user_id` bigint NOT NULL,
  `messages_message_id` bigint NOT NULL,
  PRIMARY KEY (`user_message_id`),
  KEY `FKc38rjdmetvf1d4y6dc170ilx3` (`chat_user_user_id`),
  KEY `FKk0lmg32lpdoo34gosk380jme` (`messages_message_id`),
  CONSTRAINT `FKc38rjdmetvf1d4y6dc170ilx3` FOREIGN KEY (`chat_user_user_id`) REFERENCES `chat_user` (`user_id`),
  CONSTRAINT `FKk0lmg32lpdoo34gosk380jme` FOREIGN KEY (`messages_message_id`) REFERENCES `message` (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

#Screenshots

![Screenshot 2023-12-17 135126](https://github.com/vishal1605/websocket-chat-app/assets/68631914/3c2a9cbd-d0eb-4017-84aa-3c4e2e40cd32)

![Screenshot 2023-12-17 135144](https://github.com/vishal1605/websocket-chat-app/assets/68631914/aac6b716-a4b1-4512-aaca-26139c64c92b)

![Screenshot 2023-12-17 135209](https://github.com/vishal1605/websocket-chat-app/assets/68631914/c7e855ff-4b8d-4231-8f40-441c5eaa3238)

![Screenshot 2023-12-17 135227](https://github.com/vishal1605/websocket-chat-app/assets/68631914/7770ce55-4115-4532-9cd2-63aef8438e25)

![Screenshot 2023-12-17 135250](https://github.com/vishal1605/websocket-chat-app/assets/68631914/9d828acb-853f-48e8-91eb-e05b06eaf6a8)



