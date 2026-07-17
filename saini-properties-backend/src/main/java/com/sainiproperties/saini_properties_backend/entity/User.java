package com.sainiproperties.saini_properties_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data                 // Generates getters, setters, toString, equals, and hashCode via Lombok
@NoArgsConstructor    // Generates a boilerplate-free default constructor
@AllArgsConstructor   // Generates a constructor with all arguments
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;
}