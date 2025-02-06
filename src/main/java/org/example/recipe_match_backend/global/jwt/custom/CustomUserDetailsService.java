package org.example.recipe_match_backend.global.jwt.custom;

import lombok.RequiredArgsConstructor;
import org.example.recipe_match_backend.global.exception.login.UserNotFoundException;
import org.example.recipe_match_backend.domain.user.repository.UserRepository;
import org.example.recipe_match_backend.global.jwt.custom.CustomUserDetails;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        return new CustomUserDetails(
                userRepository.findByUid(username).orElseThrow(UserNotFoundException::new));
    }



}
