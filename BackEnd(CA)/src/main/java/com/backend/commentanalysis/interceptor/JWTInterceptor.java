package com.backend.commentanalysis.interceptor;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.backend.commentanalysis.entity.User;
import com.backend.commentanalysis.exception.TokenException;
import com.backend.commentanalysis.service.IRedisService;
import com.backend.commentanalysis.service.IUserService;
import com.auth0.jwt.JWT;
import cn.hutool.core.util.StrUtil;
import com.backend.commentanalysis.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Date;

@Component
public class JWTInterceptor implements HandlerInterceptor {

    @Autowired
    private IRedisService redisService;

    @Autowired
    private IUserService userService;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("token");

        if (StrUtil.isEmpty(token)) {
            token = request.getParameter("token");
        }
        if (StrUtil.isBlank(token)) {
            throw new TokenException(401, "无权限访问");
        }
        User user = null;
        try {
            // 解码Token
            DecodedJWT decodedJWT = JWT.decode(token);

            // 检查Token是否过期
            Date expiresAt = decodedJWT.getExpiresAt();
            if (expiresAt == null || expiresAt.before(new Date())) {
                throw new TokenException(401, "Token已过期");
            }

            // 获取Payload中的信息
            String audience = decodedJWT.getAudience().get(0);
            String[] split = audience.split("-");
            String userId = split[0];
            String role = split[1];
            if ("USER".equals(role)) {
                user = userService.getUserById(Integer.parseInt(userId));
            }
            // 验证签名
            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(user.getPassword())).build();
            verifier.verify(token); // 验证Token的签名
            // Token验证成功，生成新的Token
            String newToken = JwtUtil.generateToken(user.getPhone(), user.getPassword());

            // 将新的Token通过响应头返回给客户端
            response.setHeader("new-token", newToken);

        } catch (Exception e) {
            throw new TokenException(401, "无权限访问");
        }

        return true;
    }
}