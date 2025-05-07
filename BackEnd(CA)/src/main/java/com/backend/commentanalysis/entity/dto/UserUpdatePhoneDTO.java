package com.backend.commentanalysis.entity.dto;


import lombok.Data;

@Data
public class UserUpdatePhoneDTO {
    private String phone;
    private Integer id;
    private String newPhone;
}
