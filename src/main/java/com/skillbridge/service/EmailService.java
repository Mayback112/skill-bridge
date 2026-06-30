package com.skillbridge.service;

import com.mailersend.sdk.MailerSend;
import com.mailersend.sdk.MailerSendResponse;
import com.mailersend.sdk.emails.Email;
import com.mailersend.sdk.exceptions.MailerSendException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final SpringTemplateEngine templateEngine;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${mailersend.api.token}")
    private String apiToken;

    @Value("${mailersend.from-email:MS_kMXyzY@test-86org8e6xr0gew13.mlsender.net}")
    private String fromAddress;

    public void sendVerificationEmail(String toEmail, String fullName, String token) {
        String verificationLink = frontendUrl + "/auth/graduate/verify-email?token=" + token;

        try {
            Context context = new Context();
            context.setVariable("name", fullName);
            context.setVariable("verificationLink", verificationLink);

            String htmlContent = templateEngine.process("email-verification", context);

            Email email = new Email();
            email.setFrom("SkillBridge GH", fromAddress);
            email.addRecipient(fullName, toEmail);
            email.setSubject("Verify your SKILLBRIDGE GH account");
            email.setHtml(htmlContent);
            email.setPlain("Verify your SKILLBRIDGE GH account by clicking here: " + verificationLink);

            MailerSend ms = new MailerSend();
            ms.setToken(apiToken);

            MailerSendResponse response = ms.emails().send(email);
            log.info("Verification email sent to {} with message ID: {}", toEmail, response.messageId);
        } catch (MailerSendException e) {
            log.error("Failed to send verification email to {}", toEmail, e);
            throw new RuntimeException("Failed to send verification email via MailerSend", e);
        }
    }
}
