package com.sainiproperties.saini_properties_backend.controller;

import com.sainiproperties.saini_properties_backend.DTO.QueryRequest;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class QueryController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/contact-query")
    public ResponseEntity<String> sendPropertyQuery(@RequestBody QueryRequest request) {

        try {

            // Validate required fields
            if (request.getUserEmail() == null || request.getUserEmail().isBlank()) {
                return ResponseEntity.badRequest().body("User email is required.");
            }

            if (request.getPropertyName() == null || request.getPropertyName().isBlank()) {
                return ResponseEntity.badRequest().body("Property name is required.");
            }

            if (request.getMessage() == null || request.getMessage().isBlank()) {
                return ResponseEntity.badRequest().body("Message is required.");
            }

            String userEmail = request.getUserEmail().trim();

            MimeMessage mimeMessage = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("vs7579030670@gmail.com");
            helper.setTo("vs7579030670@gmail.com");
            helper.setReplyTo(userEmail);

            helper.setSubject("New Property Inquiry - " + request.getPropertyName());

            helper.setText(
                    """
                    Property ID: %s

                    Property Name: %s

                    Customer Email: %s

                    Message:

                    %s
                    """.formatted(
                            request.getPropertyId(),
                            request.getPropertyName(),
                            userEmail,
                            request.getMessage()
                    )
            );

            mailSender.send(mimeMessage);

            return ResponseEntity.ok("Query sent successfully.");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }
}