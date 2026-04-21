package com.skillbridge.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public void sendVerificationEmail(String toEmail, String fullName, String token) {
        String verificationLink = frontendUrl + "/auth/graduate/verify-email?token=" + token;

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Context context = new Context();
            context.setVariable("name", fullName);
            context.setVariable("verificationLink", verificationLink);

            String htmlContent = templateEngine.process("email-verification", context);

            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject("Verify your SKILLBRIDGE GH account");
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Failed to send verification email to {}", toEmail, e);
        }
    }
}
