package com.skillbridge.config;

import com.skillbridge.auth.filter.JwtAuthFilter;
import com.skillbridge.auth.handler.OAuth2AuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler;
    private final CorsConfig corsConfig;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Static resources (React Frontend)
                .requestMatchers("/", "/index.html", "/assets/**", "/static/**", "/*.png", "/*.ico", "/*.svg", "/manifest.json").permitAll()
                // Public auth endpoints
                .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/graduate/verify-email").permitAll()
                // OAuth2 flow
                .requestMatchers("/api/auth/employer/google").permitAll()
                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                // Public browse endpoints
                .requestMatchers(HttpMethod.GET, "/api/graduates").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/graduates/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/courses").permitAll()
                // Allow all other non-API GET requests (for React SPA routing)
                .requestMatchers(HttpMethod.GET, "{^(?!api).*$}").permitAll()
                // All other UI routes (handled by React Router via index.html)
                .requestMatchers("/login/**", "/register/**", "/dashboard/**", "/onboarding/**", "/jobs/**", "/graduates/**", "/verify-email/**").permitAll()
                // Graduate-only endpoints
                .requestMatchers(HttpMethod.PUT, "/api/graduates/**").hasRole("GRADUATE")
                .requestMatchers(HttpMethod.POST, "/api/graduates/upload-pdf").hasRole("GRADUATE")
                // Employer-only endpoints
                .requestMatchers(HttpMethod.POST, "/api/jobs").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.PUT, "/api/jobs/**").hasRole("EMPLOYER")
                .requestMatchers(HttpMethod.DELETE, "/api/jobs/**").hasRole("EMPLOYER")
                .requestMatchers("/api/employers/**").hasRole("EMPLOYER")
                // Admin-only endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/courses").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oAuth2SuccessHandler)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
