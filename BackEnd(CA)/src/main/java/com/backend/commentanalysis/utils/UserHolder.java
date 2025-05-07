package com.backend.commentanalysis.utils;


import com.backend.commentanalysis.entity.dto.UserUpdateInfoDTO;

public class UserHolder {
    private static final ThreadLocal<UserUpdateInfoDTO> tl = new ThreadLocal<>();

    public static void saveUser(UserUpdateInfoDTO user){
        tl.set(user);
    }

    public static UserUpdateInfoDTO getUser(){
        return tl.get();
    }

    public static void removeUser(){
        tl.remove();
    }
}
