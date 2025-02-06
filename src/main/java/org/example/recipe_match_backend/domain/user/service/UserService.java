package org.example.recipe_match_backend.domain.user.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.example.recipe_match_backend.domain.user.domain.User;
import org.example.recipe_match_backend.domain.user.dto.request.AddInfoRequest;
import org.example.recipe_match_backend.domain.user.dto.request.OAuthRequest;
import org.example.recipe_match_backend.domain.user.dto.request.RefreshRequest;
import org.example.recipe_match_backend.domain.user.dto.response.TokenIncludeNicknameResponse;
import org.example.recipe_match_backend.domain.user.dto.response.TokenResponse;
import org.example.recipe_match_backend.global.exception.login.FirebaseUnAuthorization;
import org.example.recipe_match_backend.global.exception.login.InvalidToken;
import org.example.recipe_match_backend.global.exception.login.UserNotFoundException;
import org.example.recipe_match_backend.global.jwt.JwtTokenProvider;
import org.example.recipe_match_backend.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 사용자 로그인 (신규 회원, 기존 회원)
     */
    @Transactional
    public TokenIncludeNicknameResponse userLogin(OAuthRequest request) throws Exception{

        // UID 추출
        String uid = request.getUid();

        Optional<User> users = userRepository.findByUid(uid);

        if(users.isPresent()){
            // 기존 회원 로그인
            User user = users.get();
            return ExistingMemberLogin(user);
        } else {
            // 신규 회원 로그인
            return NewMemberLogin(uid);
        }
    }

    /**
     * [기존 회원 로그인]
     * Google 회원 이름이 바뀌었을 경우 회원 정보 갱신
     * accessToken과 refreshToken 발행 후 반환
     */
    private TokenIncludeNicknameResponse ExistingMemberLogin(User user) {

        String accessToken = jwtTokenProvider.createAccessToken(user.getUid());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUid());

        return new TokenIncludeNicknameResponse(accessToken, refreshToken, user.getNickname());
    }

    /**
     * [신규 회원 로그인]
     * uid, name 바탕으로 db에 유저 정보 저장
     * 그러고 나서 accessToken과 refreshToken 발행 후 반환
     */
    private TokenIncludeNicknameResponse NewMemberLogin(String uid) {
        String nickname = "User" + String.format("%010d", (long)(Math.random() * 10000000000L));

        User user = User.builder()
                .uid(uid)
                .nickname(nickname)
                .build();

        userRepository.save(user);

        String accessToken = jwtTokenProvider.createAccessToken(user.getUid());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUid());

        return new TokenIncludeNicknameResponse(accessToken, refreshToken, nickname);
    }

    /**
     * 회원의 추가 정보 저장
     */
    @Transactional
    public void updateInfo(AddInfoRequest request, User user){
        user.updateInfo(request);
        userRepository.save(user);
    }

    /**
     * [토근 재발급]
     * refreshToken 검증
     * 검증되었다면 accessToken, refreshToken 재발급
     */
    @Transactional
    public TokenResponse recreateToken(RefreshRequest refreshRequest) {

        if(!jwtTokenProvider.validateRefreshToken(refreshRequest.getRefreshToken())){
            throw new InvalidToken();
        }
        String uid = jwtTokenProvider.getUid(refreshRequest.getRefreshToken());

        User user = userRepository.findByUid(uid)
                .orElseThrow(UserNotFoundException::new);

        String accessToken = jwtTokenProvider.createAccessToken(user.getUid());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getUid());

        return new TokenResponse(accessToken, refreshToken);
    }
}
