package com.sainiproperties.saini_properties_backend.services;

import com.sainiproperties.saini_properties_backend.DTO.UserDto;

public interface userService {

    // create User
    UserDto createUser(UserDto userDto);
    
}
