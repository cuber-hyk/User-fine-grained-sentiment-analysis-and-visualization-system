package com.backend.commentanalysis.entity;


import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;


import java.time.LocalDateTime;

@Data
@EqualsAndHashCode
@Accessors(chain = true)

public class User {
    private Integer id; // bigint unsigned
    private String phone; //varchar(11)
    private String username; //varchar(32)
    private String password;
    private String icon = ""; //varchar(255)
    private LocalDateTime createTime; //timestamp
    private LocalDateTime updateTime; //timestamp
}
