package com.sainiproperties.saini_properties_backend.services;

import com.sainiproperties.saini_properties_backend.DTO.UserDto;
import com.sainiproperties.saini_properties_backend.DTO.LoginRequest;

public interface authService {
    UserDto registerUser(UserDto userDto); //[cite: 42]
    UserDto loginUser(LoginRequest loginRequest); // Added for login validation
}