package com.sainiproperties.saini_properties_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sainiproperties.saini_properties_backend.entity.User;

public interface UserRepo extends JpaRepository<User, Long>{

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
}
