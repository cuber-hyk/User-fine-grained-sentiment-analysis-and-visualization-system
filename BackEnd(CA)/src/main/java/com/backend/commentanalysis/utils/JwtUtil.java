package com.backend.commentanalysis.utils;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

import java.util.Date;

public class JwtUtil {

    private static final String SECRET_KEY = "yourSecretKey";
    private static final long EXPIRATION_TIME = 168 * 3600 * 1000; // 7天后过期

    public static String generateToken(String data, String sign) {
        return JWT.create().withAudience(data)
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(sign));
    }


}