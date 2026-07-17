package com.sainiproperties.saini_properties_backend.helper;
import com.sainiproperties.saini_properties_backend.entity.User;
import com.sainiproperties.saini_properties_backend.DTO.UserDto;

public class UserMapper {

    /**
     * Converts a User Entity into a UserDto
     */
    public static UserDto mapToUserDto(User user) {
        if (user == null) {
            return null;
        }
        
        return new UserDto(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getPassword()
        );
    }

    /**
     * Converts a UserDto into a User Entity
     */
    public static User mapToUser(UserDto userDto) {
        if (userDto == null) {
            return null;
        }
        
        User user = new User();
        user.setId(userDto.getId());
        user.setFullName(userDto.getFullName());
        user.setEmail(userDto.getEmail());
        user.setPassword(userDto.getPassword());
        
        return user;
    }
    
}
