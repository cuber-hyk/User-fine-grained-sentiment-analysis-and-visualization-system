package com.backend.commentanalysis.exception;

import com.backend.commentanalysis.enums.ResponseEnum;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;


@Data
@Schema(description = "自定义全局异常类")
public class TokenException extends RuntimeException{
    @Schema(description = "异常状态码")
    private final Integer code;

    /**
     * 通过状态码和异常信息创建异常对象
     */
    public TokenException(Integer code,String message) {
        super(message);
        this.code = code;
    }

    /**
     * 接受枚举类型对象
     */
    public TokenException(ResponseEnum responseEnum){
        super(responseEnum.getResultMessage());
        this.code = responseEnum.getCode();
    }
}