package com.backend.commentanalysis.controller;

import com.backend.commentanalysis.constants.MessageConstant;
import com.backend.commentanalysis.entity.dto.*;
import com.backend.commentanalysis.entity.Result;
import com.backend.commentanalysis.entity.User;
import com.backend.commentanalysis.exception.LoginFailedException;
import com.backend.commentanalysis.exception.PhoneIsUsedException;
import com.backend.commentanalysis.exception.UserNotExistException;
import com.backend.commentanalysis.service.IUserService;
import com.backend.commentanalysis.utils.JwtUtil;
import com.backend.commentanalysis.utils.RegexUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;


@RestController
@RequestMapping("/api/user")
@Tag(name = "用户管理接口", description = "用户相关接口")
public class UserController {

    @Autowired
    private IUserService userService;

    @PostMapping("/login")
    @Operation(summary = "登录", description = "通过手机号和密码登录")
    @ResponseBody
    public Result<UserResponseDTO> loginByPassword(@RequestBody LoginFormDTO loginFormDTO, HttpSession session) {
        String phone = loginFormDTO.getPhone();
        String password = loginFormDTO.getPassword();
        //格式验证
        if (phone == null || password == null) {
            return Result.buildFailure(201, "手机号或密码不能为空");
        }
        if (RegexUtils.isPhoneInvalid(phone)) {
            return Result.buildFailure(201, "手机号格式错误");
        }

        User user = userService.getUserByPhone(phone);
        if(user == null) {
            return Result.buildFailure(201, MessageConstant.USER_NOT_EXIST);
        }

        if (!userService.verifyPassword(phone, password)) {
            return Result.buildFailure(201, MessageConstant.PASSWORD_ERROR);
        }
        // 生成token
        String token = JwtUtil.generateToken(user.getId() + "-" + "USER", user.getPassword());

        // 返回用户信息和Token
        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setToken(token);
        responseDTO.setUserId(user.getId());
        responseDTO.setUsername(user.getUsername());

        return Result.success(responseDTO);
    }

    @PostMapping("/register")
    @Operation(summary = "用户注册", description ="返回用户账号id")
    @ResponseBody
    public Result<Object> register(@RequestBody RegisterFormDTO registerFormDTO, HttpSession session) {
        String phone = registerFormDTO.getPhone();
        String password = registerFormDTO.getPassword();
        String username = registerFormDTO.getUsername();

        //格式验证
        if (phone == null || password == null || username == null) {
            return Result.buildFailure(201, "手机号，密码或用户名不能为空");
        }
        if (RegexUtils.isPhoneInvalid(phone)) {
            return Result.buildFailure(201, "手机号格式错误，以1开头的11位数字");
        }
        if (RegexUtils.isPasswordInvalid(password)) {
            return Result.buildFailure(201, "密码格式错误， 至少包含大写字母，小写字母，特殊符号，数字各一位，长度8-20");
        }
        if (RegexUtils.isUsernameInvalid(username)) {
            return Result.buildFailure(201, "用户名格式错误，只能包含4-16位字母和数字");
        }

        if (userService.getUserByPhone(phone) != null) {
            return Result.buildFailure(201, MessageConstant.USER_EXIST);
        } else {
            return Result.success(userService.register(password, phone, username));
        }
    }

    @PostMapping("/getUser")
    @Operation(summary = "获取用户对象", description="根据ID获取用户对象")
    @ResponseBody
    public User getUser(Integer id, HttpSession session){
        return userService.getUserById(id);
    }

    @PostMapping("/updateUserInfo")
    @Operation(summary = "更新用户信息", description="更新用户信息(用户名，密码，头像")
    @ResponseBody
    public Result<Object> updateUserInfo(@RequestBody UserUpdateInfoDTO userUpdateInfoDTO, HttpSession session){
        String password = userUpdateInfoDTO.getPassword();
        String username = userUpdateInfoDTO.getUsername();
        Integer id = userUpdateInfoDTO.getId();
        String newPassword = userUpdateInfoDTO.getNewPassword();
        String iconDir= "/www/wwwroot/dachuang/resource/user/" + userUpdateInfoDTO.getId() + "/";
        MultipartFile file = userUpdateInfoDTO.getIcon();
        Path iconPath = Paths.get(iconDir);
        // 确保目录存在
        try {
            if (!Files.exists(iconPath)) {
                Files.createDirectories(iconPath);
            }

            String fileName = System.currentTimeMillis() / 1000 + "_icon";


            Path filePath = Paths.get(iconDir + fileName);
            Files.copy(file.getInputStream(), filePath);
            userService.updateUserIcon(fileName, userUpdateInfoDTO.getId());
        } catch (Exception e) {
            e.printStackTrace();
        }
        if(!Objects.equals(userService.getUserById(id).getPassword(), password)) {
            return Result.buildFailure(401, "原密码错误");
        }
        if (RegexUtils.isPasswordInvalid(newPassword)) {
            return Result.buildFailure(401,"密码格式错误， 至少包含大写字母，小写字母，特殊符号，数字各一位，长度8-20");
        }
        if (RegexUtils.isUsernameInvalid(username)) {
            return Result.buildFailure(401, "用户名格式错误，只能包含4-16位字母和数字");
        }
        if (userService.updateUserInfo(userUpdateInfoDTO)) {
            return Result.success(MessageConstant.UPDATE_SUCCESS);
        } else {
            return Result.buildFailure(401, "更新失败");
        }
    }

    @PostMapping("/updateUserPhone")
    @Operation(summary = "更新用户手机号", description="更新用户手机号")
    @ResponseBody
    public Result<Object> updateUserPhone(@RequestBody UserUpdatePhoneDTO userUpdatePhoneDTO, HttpSession session) {
        String newPhone = userUpdatePhoneDTO.getNewPhone();
        System.out.println("newPhone: " + newPhone);
        if (RegexUtils.isPhoneInvalid(newPhone)) {
            return Result.buildFailure(401, "手机号格式错误，以1开头的11位数字");
        }
        if (userService.getUserByPhone(newPhone) != null) {
            return Result.buildFailure(401, "手机号已被注册或修改后的手机号与原来一致");
        }
        if (userService.updateUserPhone(userUpdatePhoneDTO)) {
            return Result.success(MessageConstant.UPDATE_SUCCESS);
        } else {
            return Result.buildFailure(401, "更新失败, 原手机号码错误");
        }

    }

}