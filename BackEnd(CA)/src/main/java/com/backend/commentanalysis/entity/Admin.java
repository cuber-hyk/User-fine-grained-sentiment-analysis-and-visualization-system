package com.backend.commentanalysis.entity;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class Admin {
    private Integer id; // bigint unsigned
    private String phone; //varchar(11)
    private String username; //varchar(32)
    private String password;
    private String icon = ""; //varchar(255)
    private LocalDateTime createTime; //timestamp
    private LocalDateTime updateTime; //timestamp


}
