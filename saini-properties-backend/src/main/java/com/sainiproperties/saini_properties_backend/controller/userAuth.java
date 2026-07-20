package com.sainiproperties.saini_properties_backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.sainiproperties.saini_properties_backend.DTO.UserDto;
import com.sainiproperties.saini_properties_backend.DTO.LoginRequest;
import com.sainiproperties.saini_properties_backend.services.authService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth") //[cite: 37]
@RequiredArgsConstructor //[cite: 37]
@CrossOrigin(origins = "https://saini-properties-inyy-eight.vercel.app") //[cite: 37]
public class userAuth {

    private final authService authenticationService; //[cite: 37]

    @PostMapping("/register") //[cite: 37]
    public ResponseEntity<UserDto> registerUser(@RequestBody UserDto userDto) { //[cite: 37]
        UserDto savedUser = authenticationService.registerUser(userDto); //[cite: 37]
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser); //[cite: 37]
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            UserDto loggedInUser = authenticationService.loginUser(loginRequest);
            return ResponseEntity.ok(loggedInUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}