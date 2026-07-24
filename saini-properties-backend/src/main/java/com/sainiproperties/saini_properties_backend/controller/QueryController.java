package com.sainiproperties.saini_properties_backend.controller;

import com.sainiproperties.saini_properties_backend.DTO.QueryRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * NOTE ON EMAIL DELIVERY:
 * Render's free web-service tier blocks outbound traffic on SMTP ports
 * (25, 465, 587) as of Sept 2025. Since Gmail SMTP uses port 587,
 * JavaMailSender
 * would hang/fail with a connection error in production even though it works
 * fine locally. To avoid that, this sends email over plain HTTPS using Brevo's
 * transactional email API instead of SMTP.
 */
@RestController
@RequestMapping("/api")
public class QueryController {

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
    private static final String ADMIN_EMAIL = "saini40vansh@gmail.com";

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

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

            String htmlContent = """
                    <p><b>Property ID:</b> %s</p>
                    <p><b>Property Name:</b> %s</p>
                    <p><b>Customer Email:</b> %s</p>
                    <p><b>Message:</b></p>
                    <p>%s</p>
                    """.formatted(
                    request.getPropertyId(),
                    request.getPropertyName(),
                    userEmail,
                    request.getMessage());

            Map<String, Object> sender = new HashMap<>();
            sender.put("name", "Saini Properties");
            sender.put("email", ADMIN_EMAIL);

            Map<String, Object> recipient = new HashMap<>();
            recipient.put("email", ADMIN_EMAIL);

            Map<String, Object> body = new HashMap<>();
            body.put("sender", sender);
            body.put("to", List.of(recipient));
            body.put("replyTo", Map.of("email", userEmail));
            body.put("subject", "New Property Inquiry - " + request.getPropertyName());
            body.put("htmlContent", htmlContent);

            HttpHeaders headers = new HttpHeaders();
            headers.set("api-key", brevoApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));

            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);

            try {
                ResponseEntity<String> response = restTemplate.postForEntity(BREVO_API_URL, httpEntity, String.class);

                return ResponseEntity.ok(response.getBody());

            } catch (org.springframework.web.client.HttpStatusCodeException e) {

                System.out.println("Status: " + e.getStatusCode());
                System.out.println("Response: " + e.getResponseBodyAsString());

                return ResponseEntity.status(e.getStatusCode())
                        .body(e.getResponseBodyAsString());
            }

            return ResponseEntity.ok("Query sent successfully.");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }
}