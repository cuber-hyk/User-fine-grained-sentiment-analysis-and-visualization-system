package com.backend.commentanalysis.mapper;

import com.backend.commentanalysis.entity.User;

import com.backend.commentanalysis.entity.dto.UserUpdateInfoDTO;
import com.backend.commentanalysis.entity.dto.UserUpdatePhoneDTO;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {
    @Select("select * from tb_user where phone = #{phone}")
    User getUserByPhone(String phone);

    @Select("select * from tb_user where password = #{password} and phone = #{phone}")
    Boolean loginByPassword(String password, String phone);

    Integer register(String password, String phone, String username);

    @Select("select * from tb_user where id = #{uid}")
    User getUserById(Integer uid);

    Boolean updateUserInfo(UserUpdateInfoDTO userUpdateInfoDTO);


    @Update("update tb_user set icon = #{iconUrl} where id = #{id}")
    Boolean updateUserIcon(String iconUrl, Integer id);

    Boolean updateUserPhone(UserUpdatePhoneDTO userUpdatePhoneDTO);

    @Select("select password from tb_user where password = #{password} and phone = #{phone}")
    String verifyPassword(String phone, String password);
}