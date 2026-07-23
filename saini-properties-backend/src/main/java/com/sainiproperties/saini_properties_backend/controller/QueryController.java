package com.sainiproperties.saini_properties_backend.controller;

import com.sainiproperties.saini_properties_backend.DTO.QueryRequest;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
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

            MimeMessage mimeMessage = mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, true);

            helper.setFrom("vs7579030670@gmail.com");

            helper.setTo("vs7579030670@gmail.com");

            // THIS IS THE IMPORTANT PART
            helper.setReplyTo(request.getUserEmail());

            helper.setSubject(
                    "New Property Inquiry - " + request.getPropertyName()
            );

            helper.setText(
                    "Property ID: " + request.getPropertyId()
                    + "\n\nProperty: " + request.getPropertyName()
                    + "\n\nUser Email: " + request.getUserEmail()
                    + "\n\nMessage:\n"
                    + request.getMessage()
            );

            mailSender.send(mimeMessage);

            return ResponseEntity.ok("Query sent successfully");

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());

        }

    }

}