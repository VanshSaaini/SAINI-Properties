package com.sainiproperties.saini_properties_backend.services.impl;

import org.springframework.stereotype.Service;
import com.sainiproperties.saini_properties_backend.DTO.UserDto; // Fixed lowercase package name
import com.sainiproperties.saini_properties_backend.entity.User;
import com.sainiproperties.saini_properties_backend.helper.UserMapper; // Fixed package path to match our mapper
import com.sainiproperties.saini_properties_backend.repository.UserRepo;
import com.sainiproperties.saini_properties_backend.services.userService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class userServiceImpl implements userService {
    
    private final UserRepo userRepo;

    @Override
    public UserDto createUser(UserDto userDto) {

        if (userDto.getEmail() == null || userDto.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required!!");
        }

        if (userRepo.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Email Already Exists!!");
        }

        // Using our static utility mapping methods directly
        User user = UserMapper.mapToUser(userDto);
        User savedUser = userRepo.save(user);

        return UserMapper.mapToUserDto(savedUser);
    }
}