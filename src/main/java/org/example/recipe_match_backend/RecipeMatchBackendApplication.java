package org.example.recipe_match_backend;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class RecipeMatchBackendApplication {

    @Value("${jwt.secret:default-value}") // jwt.secret 값 가져오기
    private String jwtSecret;

    public static void main(String[] args) {
        SpringApplication.run(RecipeMatchBackendApplication.class, args);
    }
    // 애플리케이션 실행 후 jwt.secret 값 확인 로그 추가
    @PostConstruct
    public void logSecret() {
        System.out.println("Loaded JWT_SECRET: " + jwtSecret);
    }

}
