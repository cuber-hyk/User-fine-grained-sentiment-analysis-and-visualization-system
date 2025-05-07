package com.backend.commentanalysis.config;

import com.backend.commentanalysis.interceptor.JWTInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private JWTInterceptor myJwtInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(myJwtInterceptor)
                .addPathPatterns("/api/**") // 拦截所有请求
                .excludePathPatterns(
                        "/api/user/login",          // 排除登录接口
                        "/api/product/register",       // 排除注册接口
                        "/error",          // 排除错误页面
                        "/static/**",      // 排除静态资源
                        "/swagger-ui/**",  // 排除Swagger UI
                        "/v3/api-docs/**", // 排除API文档
                        "/doc.html/**"
                        );
    }
}