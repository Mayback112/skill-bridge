package com.skillbridge.util;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class EmailValidator {

    private static final Pattern UPSA_EMAIL_PATTERN =
        Pattern.compile("^[a-zA-Z0-9._%+-]+@upsa\\.edu\\.gh$", Pattern.CASE_INSENSITIVE);

    private static final Pattern GMAIL_PATTERN =
        Pattern.compile("^[a-zA-Z0-9._%+-]+@gmail\\.com$", Pattern.CASE_INSENSITIVE);

    public boolean isValidUpsaEmail(String email) {
        return email != null && UPSA_EMAIL_PATTERN.matcher(email).matches();
    }

    public boolean isValidGmailEmail(String email) {
        return email != null && GMAIL_PATTERN.matcher(email).matches();
    }
}
