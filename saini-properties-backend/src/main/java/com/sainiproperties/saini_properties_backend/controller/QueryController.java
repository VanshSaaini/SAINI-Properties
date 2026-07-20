package com.sainiproperties.saini_properties_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "https://saini-properties-inyy-eight.vercel.app"})
public class QueryController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/contact-query")
    public ResponseEntity<String> sendPropertyQuery(@RequestBody QueryRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("vs7579030670@gmail.com");
            message.setTo("vs7579030670@gmail.com");
            message.setSubject("New Property Query: " + request.getPropertyName() + " (ID: " + request.getPropertyId() + ")");
            message.setText("Sender Email: " + request.getUserEmail() + "\n\nQuery Details:\n" + request.getMessage());

            mailSender.send(message);
            return ResponseEntity.ok("Query email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class QueryRequest {
    private String targetEmail;
    private String userEmail;
    private Long propertyId;
    private String propertyName;
    private String message;
}