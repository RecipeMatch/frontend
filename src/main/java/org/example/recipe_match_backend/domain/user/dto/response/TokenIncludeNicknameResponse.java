package org.example.recipe_match_backend.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class TokenIncludeNicknameResponse {

    private String accessToken;
    private String refreshToken;
    private String nickname;

}
