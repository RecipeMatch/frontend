package org.example.recipe_match_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api") // 모든 API 요청은 "/api" 경로로 시작
public class PingController {

    @GetMapping("/ping") // "/api/ping" 경로로 요청이 오면 실행
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Pong! 연결 성공!");
    }
}
