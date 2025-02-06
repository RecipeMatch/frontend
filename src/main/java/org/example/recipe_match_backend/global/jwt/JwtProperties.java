package org.example.recipe_match_backend.global.jwt;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class JwtProperties {

    @Value("${jwt.secret}")
    private String secretKey;  // base64 인코딩된 비밀키라고 가정

    @Value("${jwt.expiration.accessToken}")
    private long accessTokenExpiration;  // 3시간 -> 10800000

    @Value("${jwt.expiration.refreshToken}")
    private long refreshTokenExpiration; // 14일 -> 1209600000
}
