package com.backend.commentanalysis.service.implement;

import com.backend.commentanalysis.service.IRedisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService implements IRedisService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    // 将Token加入黑名单，设置过期时间（可选）
    public void addToBlacklist(String token, long expireTime) {
        redisTemplate.opsForValue().set(token, "blacklisted", expireTime, TimeUnit.MILLISECONDS);
    }

    // 检查Token是否在黑名单中
    public boolean isBlacklisted(String token) {
        return redisTemplate.hasKey(token);
    }

    public boolean hasKey(String key){
        return redisTemplate.hasKey(key);
    }
}