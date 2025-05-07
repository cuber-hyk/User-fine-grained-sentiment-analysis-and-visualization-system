package com.backend.commentanalysis.service;

public interface IRedisService {
    public void addToBlacklist(String token, long expireTime);
    public boolean isBlacklisted(String token);
}
