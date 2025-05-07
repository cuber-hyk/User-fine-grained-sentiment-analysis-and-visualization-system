package com.backend.commentanalysis.entity.dto;

import lombok.Data;


// Data Transfer Object DTO
@Data
public class LoginFormDTO {

    /**
    * Unique user identifier, automatically generated upon user registration.
    * Rationale: Using a unique identifier ensures user data can be accurately identified and retrieved, enhancing data management efficiency and security.
    */
    private String phone;//five numbers auto generated from 10000 to 99999
    private String password;
}