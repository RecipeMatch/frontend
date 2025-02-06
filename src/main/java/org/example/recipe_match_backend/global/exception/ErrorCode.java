package org.example.recipe_match_backend.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // common
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "EC001", "서버 오류가 발생했습니다."),

    // login
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "EL001", "사용자를 찾을 수 없습니다."),
    DUPLICATE_USER(HttpStatus.CONFLICT, "EL002", "이미 존재하는 사용자입니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "EL003", "유효하지 않은 토큰입니다."),
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "EL004", "접근이 거부되었습니다."),
    FIREBASE_AUTHORIZATION_TO_BE_FAILED(HttpStatus.UNAUTHORIZED, "EL005", "Firebase 인증 실패했습니다.")
    ;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
