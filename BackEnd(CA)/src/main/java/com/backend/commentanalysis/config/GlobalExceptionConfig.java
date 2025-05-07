package com.backend.commentanalysis.config;


import com.backend.commentanalysis.entity.Result;
import com.backend.commentanalysis.exception.LoginFailedException;
import com.backend.commentanalysis.exception.PhoneIsUsedException;
import com.backend.commentanalysis.exception.TokenException;
import com.backend.commentanalysis.exception.UserNotExistException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.security.auth.login.LoginException;

@RestControllerAdvice
public class GlobalExceptionConfig{
    @ExceptionHandler(TokenException.class)
    public Result<TokenException> handle(TokenException e){
        e.printStackTrace();
        return Result.exception(e.getCode(),e.getMessage());
    }

    @ExceptionHandler(UserNotExistException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public Result<String> handleUserNotExistException(UserNotExistException e) {
        return Result.buildFailure(201, e.getMessage());
    }

    @ExceptionHandler(PhoneIsUsedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public Result<String> handlePhoneIsUsedException(PhoneIsUsedException e) {
        return Result.buildFailure(201, e.getMessage());
    }

    @ExceptionHandler(LoginFailedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ResponseBody
    public Result<String> handleLoginFailedException(LoginFailedException e) {
        return Result.buildFailure(201, e.getMessage());
    }


















}