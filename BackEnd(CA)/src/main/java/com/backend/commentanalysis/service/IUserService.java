package com.backend.commentanalysis.service;

import com.backend.commentanalysis.entity.User;
import com.backend.commentanalysis.entity.dto.UserUpdateInfoDTO;
import com.backend.commentanalysis.entity.dto.UserUpdatePhoneDTO;

public interface IUserService {

    boolean verifyPassword(String phone, String password);

    User getUserByPhone(String phone);

    Boolean loginByPassword(String password, String phone);

    Integer register(String password, String phone, String username);

    User getUserById(Integer id);

    Boolean updateUserInfo(UserUpdateInfoDTO userUpdateInfoDTO);

    void updateUserIcon(String iconUrl, Integer id);

    Boolean updateUserPhone(UserUpdatePhoneDTO userUpdatePhoneDTO);

}