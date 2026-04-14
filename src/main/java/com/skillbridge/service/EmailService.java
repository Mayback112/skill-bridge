package com.skillbridge.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public void sendVerificationEmail(String toEmail, String token) {
        String verificationLink = baseUrl + "/api/auth/graduate/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Verify your SKILLBRIDGE GH account");
        message.setText(
            "Hello,\n\n" +
            "Thank you for registering with SKILLBRIDGE GH.\n\n" +
            "Please click the link below to verify your email address:\n\n" +
            verificationLink + "\n\n" +
            "This link expires in 24 hours.\n\n" +
            "If you did not register, please ignore this email.\n\n" +
            "SKILLBRIDGE GH Team"
        );

        mailSender.send(message);
    }
}
