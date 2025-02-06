package org.example.recipe_match_backend.global.exception.login;

import org.example.recipe_match_backend.global.exception.BusinessException;
import org.example.recipe_match_backend.global.exception.ErrorCode;


public class FirebaseUnAuthorization extends BusinessException {
    public FirebaseUnAuthorization() {
        super(ErrorCode.FIREBASE_AUTHORIZATION_TO_BE_FAILED);
    }
}
