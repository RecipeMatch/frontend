package org.example.recipe_match_backend.global.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Slf4j
@RequiredArgsConstructor
@Component
public class JwtTokenProvider implements InitializingBean {

    private final JwtProperties jwtProperties;
    private Key key;

    @Override
    public void afterPropertiesSet() {
        // 만약 secretKey가 Base64 인코딩 문자열이면 decode해서 Key 객체를 만든다
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtProperties.getSecretKey()));
    }

    /**
     * Access Token 생성
     * @param uid 구글 UID 또는 우리 서비스에서 사용하는 식별자
     * @return Access Token
     */
    public String createAccessToken(String uid) {

        Claims claims = Jwts.claims().setSubject(uid);
        claims.put("token_type", "accessToken");

        Date validity = new Date((new Date()).getTime() + jwtProperties.getRefreshTokenExpiration());

        return Jwts.builder()
                .setClaims(claims)                          // token_type, accessToken
                .setExpiration(validity)                    // 만료 시각
                .signWith(key, SignatureAlgorithm.HS256)    // 서명
                .compact();
    }

    /**
     * Refresh Token 생성
     * @param uid 구글 UID 또는 우리 서비스에서 사용하는 식별자
     * @return Refresh Token
     */
    public String createRefreshToken(String uid) {
        Claims claims = Jwts.claims().setSubject(uid);
        claims.put("token_type", "refreshToken");

        Date validity = new Date((new Date()).getTime() + jwtProperties.getRefreshTokenExpiration());

        return Jwts.builder()
                .setClaims(claims)                          // token_type, refreshToken
                .setExpiration(validity)                    // 만료 시각
                .signWith(key, SignatureAlgorithm.HS256)    // 서명
                .compact();
    }

    /**
     * Access Token 검증
     * - 토큰이 유효하고, token_type이 accessToken인지 확인
     * @param accessToken Access Token 문자열
     * @return 유효하면 true, 아니면 false
     */
    public boolean validateAccessToken(String accessToken) {
        try {
            Claims claims = parseClaims(accessToken);

            String tokenType = (String) claims.get("token_type");
            if (!tokenType.equals("accessToken")) {
                log.warn("토큰 타입(accessToken) 불일치");
                return false;
            }

            return !claims.getExpiration().before(new Date());

        } catch (SecurityException | MalformedJwtException e) {
            log.warn("잘못된 JWT 서명입니다.", e);
        } catch (ExpiredJwtException e) {
            log.warn("만료된 JWT 입니다.", e);
        } catch (UnsupportedJwtException e) {
            log.warn("지원되지 않는 JWT 입니다.", e);
        } catch (IllegalArgumentException e) {
            log.warn("JWT가 잘못되었습니다.", e);
        }
        return false;
    }

    /**
     * Refresh Token 검증
     * - 토큰이 유효하고, token_type이 refreshToken인지 확인
     * @param refreshToken Refresh Token 문자열
     * @return 유효하면 true, 아니면 false
     */
    public boolean validateRefreshToken(String refreshToken) {
        try {
            Claims claims = parseClaims(refreshToken);

            String tokenType = (String) claims.get("token_type");
            if (!tokenType.equals("refreshToken")) {
                log.warn("토큰 타입(refreshToken) 불일치");
                return false;
            }

            return !claims.getExpiration().before(new Date());

        } catch (SecurityException | MalformedJwtException e) {
            log.warn("잘못된 JWT 서명입니다.", e);
        } catch (ExpiredJwtException e) {
            log.warn("만료된 JWT 입니다.", e);
        } catch (UnsupportedJwtException e) {
            log.warn("지원되지 않는 JWT 입니다.", e);
        } catch (IllegalArgumentException e) {
            log.warn("JWT가 잘못되었습니다.", e);
        }
        return false;
    }

    // uid 추출
    public String getUid(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * JWT 파싱 메서드
     * - 서명 검증 + 만료 확인
     * - 정상이라면 Claims 반환
     */
    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)    // 서명 검증 키
                .build()
                .parseClaimsJws(token) // 실패 시 예외 발생
                .getBody();
    }

}
