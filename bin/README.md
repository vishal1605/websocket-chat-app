# websocket-chat-app

Spring boot Websocket chat app

  

# Sql Queries for create table structure
###  1) Chat user table

```sql
CREATE TABLE `chat_user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile_img` longblob,
  `user_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
###  2) Message table
```sql
CREATE TABLE `message` (
  `message_id` bigint NOT NULL,
  `content` longtext,
  `recieved_date` varchar(255) DEFAULT NULL,
  `send_date` varchar(255) DEFAULT NULL,
  `to_user_user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `FKqumcy6hmow228nk518uy1ayyd` (`to_user_user_id`),
  CONSTRAINT `FKqumcy6hmow228nk518uy1ayyd` FOREIGN KEY (`to_user_user_id`) REFERENCES `chat_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
###  3) Chat user friends table
```sql
CREATE TABLE `chat_user_friends` (
  `f_id` bigint NOT NULL AUTO_INCREMENT,
  `chat_user_user_id` bigint NOT NULL,
  `friends_user_id` bigint NOT NULL,
  PRIMARY KEY (`f_id`),
  KEY `FKip4ovgrif9y6h8hdewk0r2tvo` (`chat_user_user_id`),
  KEY `FKh9n2od5nvvwg5dbjqu2sex77g` (`friends_user_id`),
  CONSTRAINT `FKh9n2od5nvvwg5dbjqu2sex77g` FOREIGN KEY (`friends_user_id`) REFERENCES `chat_user` (`user_id`),
  CONSTRAINT `FKip4ovgrif9y6h8hdewk0r2tvo` FOREIGN KEY (`chat_user_user_id`) REFERENCES `chat_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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