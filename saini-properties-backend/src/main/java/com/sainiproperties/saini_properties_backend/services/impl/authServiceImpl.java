package com.sainiproperties.saini_properties_backend.services.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.sainiproperties.saini_properties_backend.DTO.UserDto;
import com.sainiproperties.saini_properties_backend.DTO.LoginRequest;
import com.sainiproperties.saini_properties_backend.entity.User;
import com.sainiproperties.saini_properties_backend.helper.UserMapper;
import com.sainiproperties.saini_properties_backend.repository.UserRepo;
import com.sainiproperties.saini_properties_backend.services.authService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class authServiceImpl implements authService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder; 

    @Override
    public UserDto registerUser(UserDto userDto) {
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        // Directly map and save for simplicity or delegate to userservice[cite: 44]
        User user = UserMapper.mapToUser(userDto);
        return UserMapper.mapToUserDto(userRepo.save(user));
    }

    @Override
    public UserDto loginUser(LoginRequest loginRequest) {
        // Find user by email[cite: 41]
        User user = userRepo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Email or Password!"));

        // Match raw password with hashed password stored in DB
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid Email or Password!");
        }

        // Return user profile on success (password should ideally be cleared out here)
        UserDto responseDto = UserMapper.mapToUserDto(user);
        responseDto.setPassword(null); 
        return responseDto;
    }
}