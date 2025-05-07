package com.backend.commentanalysis.entity.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserUpdateInfoDTO {
    private Integer id;
    private String username;
    private String newPassword;
    private String password;
    private MultipartFile icon;

}
