package org.example.recipe_match_backend.global.exception.login;

import org.example.recipe_match_backend.global.exception.BusinessException;
import org.example.recipe_match_backend.global.exception.ErrorCode;

public class InvalidToken extends BusinessException {
    public InvalidToken() {
        super(ErrorCode.INVALID_TOKEN);
    }
}
