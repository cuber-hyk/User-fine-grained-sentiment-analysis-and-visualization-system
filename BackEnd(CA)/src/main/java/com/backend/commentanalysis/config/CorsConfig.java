package com.backend.commentanalysis.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/upload")
                .allowedOrigins("http://0.0.0.0") // 允许的前端地址
                .allowedMethods("POST")
                .allowedHeaders("*");
    }
}