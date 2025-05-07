package com.backend.commentanalysis.exception;

public class UserNotExistException extends BaseException {
    public UserNotExistException(String message) {
        super(message);
    }
}