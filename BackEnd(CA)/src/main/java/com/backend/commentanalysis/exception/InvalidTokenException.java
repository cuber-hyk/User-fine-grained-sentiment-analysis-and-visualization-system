package com.backend.commentanalysis.exception;

public class InvalidTokenException extends BaseException{
    public InvalidTokenException(String message) {
        super("InvalidToken" + message);
    }
}
