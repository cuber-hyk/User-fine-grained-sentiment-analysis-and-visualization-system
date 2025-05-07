package com.backend.commentanalysis.entity;

import com.backend.commentanalysis.enums.ResponseEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
public class Result<T> implements java.io.Serializable{
    private Integer code; //业务状态码 0成功 1失败
    private String message;//提示信息
    private T data;//返回数据
    private Result(){}
    public static <T> Result<T> success(T data) {
        Result<T> response = new Result<>();
        response.setCode(ResponseEnum.SUCCESS.getCode());
        response.setMessage(ResponseEnum.SUCCESS.getResultMessage());
        response.setData(data);
        return response;
    }
    public static <T> Result<T> buildFailure(Integer code, String message) {
        Result<T> response = new Result<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }

    public static <T> Result<T> exception(Integer code, String message) {
        Result<T> response = new Result<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }
}
