CREATE DATABASE demo;

USE demo;

CREATE TABLE user(
                     id bigint(20) not null auto_increment,
                     user_id bigint(20) not null,
                     username varchar(64) collate utf8mb4_general_ci not null,
                     password varchar(64) collate utf8mb4_general_ci not null,
                     email varchar(64) collate utf8mb4_general_ci,
                     gender tinyint(4) not null default 0,
                     create_time timestamp null default current_timestamp,
                     update_time timestamp null default current_timestamp on update current_timestamp,
                     primary key (id),
                     unique key idx_username (username) using  BTREE,
                     unique key idx_user_id (user_id) using  BTREE
) engine=InnoDB default charset = utf8mb4 collate = utf8mb4_general_ci;


CREATE TABLE `favorite` (
                            `user_id` bigint NOT NULL,
                            `movie_id` bigint NOT NULL,
                            `path` varchar(255) DEFAULT NULL,
                            `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
                            `original_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
                            `poster_path` varchar(255) DEFAULT NULL,
                            `added_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                            PRIMARY KEY (`user_id`,`movie_id`),
                            CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;