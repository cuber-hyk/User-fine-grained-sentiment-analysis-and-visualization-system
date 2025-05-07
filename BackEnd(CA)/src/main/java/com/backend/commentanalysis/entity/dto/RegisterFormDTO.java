package com.backend.commentanalysis.entity.dto;

import lombok.Data;

@Data
public class RegisterFormDTO {
    private String username;
    private String password;
    private String phone;
}