package com.backend.commentanalysis.service.implement;


import com.backend.commentanalysis.entity.User;
import com.backend.commentanalysis.entity.dto.UserUpdateInfoDTO;
import com.backend.commentanalysis.entity.dto.UserUpdatePhoneDTO;
import com.backend.commentanalysis.mapper.UserMapper;
import com.backend.commentanalysis.service.IUserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    UserMapper userMapper;
    @Autowired
    StringRedisTemplate stringRedisTemplate;


    @Override
    public boolean verifyPassword(String phone, String password) {
        return userMapper.verifyPassword(phone, password) != null;
    }

    @Override
    public User getUserByPhone(String phone) {
        return userMapper.getUserByPhone(phone);
    }

    @Override
    public Boolean loginByPassword(String password, String phone) {
        return userMapper.loginByPassword(password, phone);
    }

    @Override
    public Integer register(String password, String phone, String username) {
        return userMapper.register(password, phone, username);
    }

    @Override
    @Cacheable(value = "user", key = "#id")
    public User getUserById(Integer id) {
        return userMapper.getUserById(id);
    }

    @Override
    public Boolean updateUserInfo(UserUpdateInfoDTO userUpdateInfoDTO) {
        return userMapper.updateUserInfo(userUpdateInfoDTO);
    }

    @Override
    public void updateUserIcon(String iconUrl, Integer id) {
        userMapper.updateUserIcon(iconUrl, id);
    }

    @Override
    public Boolean updateUserPhone(UserUpdatePhoneDTO userUpdatePhoneDTO) {
        return userMapper.updateUserPhone(userUpdatePhoneDTO);
    }
}
